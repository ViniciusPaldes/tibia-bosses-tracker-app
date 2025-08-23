import { updateUserWorld } from '@/services/api/push';
import { captureException } from '@/services/api/sentry';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { SELECTED_WORLD_KEY, WORLD_LIST_KEY } from '../cache/keys';
import { getWithTTL, setWithTTL } from '../cache/storage';
import { BossChances, ensureBossChancesForToday, fetchBossChances, getCachedBossChances, setCachedBossChances, sortBossesByChance } from '../chances';
import { fetchWorlds } from './api';

const TTL_90_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

function dedupeAndSort(names: string[]): string[] {
  return Array.from(new Set(names.map((n) => n.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function useWorlds() {
  const [data, setData] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    // cache first
    const cached = await getWithTTL<string[]>(WORLD_LIST_KEY, TTL_90_DAYS_MS);
    if (cached && cached.length) {
      setData(cached);
      setLoading(false);
      // refresh in background
      try {
        const fresh = await fetchWorlds();
        const names = dedupeAndSort(fresh.worlds.regular_worlds.map((w) => w.name));
        await setWithTTL(WORLD_LIST_KEY, names);
        setData(names);
      } catch (e) {
        captureException(e, 'data/worlds/hooks:useWorlds:backgroundRefresh');
      }
      return;
    }

    // no valid cache → fetch with one retry on transient errors
    try {
      const fresh = await fetchWorlds();
      const names = dedupeAndSort(fresh.worlds.regular_worlds.map((w) => w.name));
      await setWithTTL(WORLD_LIST_KEY, names);
      setData(names);
    } catch (e: any) {
      // retry once for 5xx/network
      try {
        await new Promise((r) => setTimeout(r, 400));
        const fresh2 = await fetchWorlds();
        const names2 = dedupeAndSort(fresh2.worlds.regular_worlds.map((w) => w.name));
        await setWithTTL(WORLD_LIST_KEY, names2);
        setData(names2);
      } catch (e2: any) {
        setError(e2?.message ?? 'Failed to load worlds');
        captureException(e2, 'data/worlds/hooks:useWorlds:fetch');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refetch = useCallback(() => load(), [load]);

  return { data: data ?? [], loading, error, refetch } as const;
}

export async function loadSelectedWorld(): Promise<string | null> {
  const raw = await getWithTTL<string>(SELECTED_WORLD_KEY, Number.MAX_SAFE_INTEGER);
  return raw ?? null;
}

export async function saveSelectedWorld(name: string): Promise<void> {
  await setWithTTL(SELECTED_WORLD_KEY, name);
  // Also persist to Firestore user profile for world-scoped notifications
  try { await updateUserWorld(name); } catch (e) { captureException(e, 'data/worlds/hooks:saveSelectedWorld:updateUserWorld'); }
}

// Fetch boss chances for the currently selected world. Cached per day.
export function useBossChances(selectedWorld: string | null) {
  const [data, setData] = useState<BossChances | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!selectedWorld) return;
    setLoading(true);
    setError(null);
    try {
      // Only read from saved local data after it has been fetched once for the day.
      // We attempt to read; if missing, we fetch and then set; subsequent reads today use cache.
      const cached = await getCachedBossChances(selectedWorld);
      if (cached && cached.length) {
        setData(sortBossesByChance(cached));
        setLoading(false);
        return;
      }

      const { date, data } = await fetchBossChances(selectedWorld);
      await setCachedBossChances(selectedWorld, date, data);
      setData(sortBossesByChance(data));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load boss chances');
    } finally {
      setLoading(false);
    }
  }, [selectedWorld]);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-refresh when app returns to foreground and the day boundary (08:10 UTC) may have crossed
  useEffect(() => {
    if (!selectedWorld) return;
    let mounted = true;
    const subscription = AppState.addEventListener('change', async (state) => {
      if (!mounted) return;
      if (state !== 'active') return;
      try {
        const fresh = await ensureBossChancesForToday(selectedWorld);
        setData(sortBossesByChance(fresh));
      } catch (e) {
        captureException(e, 'data/worlds/hooks:useBossChances:foregroundRefresh');
      }
    });
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [selectedWorld]);

  const refetch = useCallback(() => load(), [load]);

  return { data: data ?? [], loading, error, refetch } as const;
}


