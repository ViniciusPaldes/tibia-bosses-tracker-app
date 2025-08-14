import { getWithTTL, setWithTTL } from '@/data/cache/storage';
import { db } from '@/services/firestore';
import { collection, limit as limitQ, onSnapshot, orderBy, query, where, type DocumentData, type QuerySnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Sighting } from './types';

const TTL_24_HOURS_MS = 24 * 60 * 60 * 1000;
const KEY_PREFIX = 'sightings:world:v1';

function buildCacheKey(world: string) {
  return `${KEY_PREFIX}:${world}`;
}

export function useRecentSightings(world: string | null, limit: number = 50) {
  const [data, setData] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  const mapSnapshot = useCallback((snap: QuerySnapshot<DocumentData>) => {
    const items: Sighting[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Sighting[];
    setData(items);
    setWithTTL(buildCacheKey(world || 'unknown'), items).catch(() => {});
  }, [world]);

  const load = useCallback(async () => {
    if (!world) return;
    setLoading(true);
    setError(null);
    try {
      const cached = await getWithTTL<Sighting[]>(buildCacheKey(world), TTL_24_HOURS_MS);
      if (cached && cached.length) setData(cached);

      const q = query(
        collection(db, 'sightings'),
        where('world', '==', world),
        orderBy('createdAt', 'desc'),
        limitQ(limit)
      );
      if (unsubRef.current) unsubRef.current();
      unsubRef.current = onSnapshot(q, mapSnapshot, (e) => setError(e.message));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load sightings');
    } finally {
      setLoading(false);
    }
  }, [world, limit, mapSnapshot]);

  useEffect(() => {
    load();
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [load]);

  const refetch = useCallback(() => load(), [load]);
  // Build latestByBoss and killedSet from the sorted snapshot (desc by createdAt)
  const latestByBoss = useMemo(() => {
    const map: Record<string, { status: 'spotted' | 'killed' | 'checked'; createdAt: any } | undefined> = {};
    for (const s of data) {
      const name = s.bossName;
      if (!name) continue;
      if (map[name]) continue; // first occurrence is latest due to ordering
      map[name] = { status: s.status, createdAt: s.createdAt } as any;
    }
    return map as Record<string, { status: 'spotted' | 'killed' | 'checked'; createdAt: any }>;
  }, [data]);

  const killedSet = useMemo(() => {
    const set = new Set<string>();
    Object.entries(latestByBoss).forEach(([name, info]) => {
      if (info?.status === 'killed') set.add(name);
    });
    return set;
  }, [latestByBoss]);

  return { data, loading, error, refetch, latestByBoss, killedSet } as const;
}


