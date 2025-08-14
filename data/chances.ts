// data/chances.ts
import { BOSS_CHANCES_KEY_PREFIX } from './cache/keys';
import { getWithTTL, setWithTTL } from './cache/storage';

export type BossChanceLevel = 'high' | 'medium' | 'low' | 'lost track' | 'no chance';

export type BossChanceItem = {
  // id may be absent in API; derive from name when needed
  id?: string;
  name: string;
  start_day?: number;
  end_day?: number;
  city?: string;
  location?: string[];
  loots?: string[];
  lastSeen?: string;
  daysSince?: number;
  chance: BossChanceLevel;
};

export type BossChances = BossChanceItem[];

function deriveIdFromName(name: string | undefined): string | undefined {
  if (!name) return undefined;
  return name.toLowerCase().replace(/\s+/g, '');
}

function normalizeBoss(input: any): BossChanceItem {
  const name: string = input?.name ?? 'Unknown';
  const id: string | undefined = input?.id ?? deriveIdFromName(name);
  return {
    id,
    name,
    start_day: typeof input?.start_day === 'number' ? input.start_day : undefined,
    end_day: typeof input?.end_day === 'number' ? input.end_day : undefined,
    city: typeof input?.city === 'string' ? input.city : undefined,
    location: Array.isArray(input?.location) ? (input.location as string[]) : undefined,
    loots: Array.isArray(input?.loots) ? (input.loots as string[]) : undefined,
    lastSeen: typeof input?.lastSeen === 'string' ? input.lastSeen : undefined,
    daysSince: typeof input?.daysSince === 'number' ? input.daysSince : undefined,
    chance: (input?.chance as BossChanceLevel) ?? 'no chance',
  } as BossChanceItem;
}

function getTargetDateUTC(now: Date): string {
  const hour = now.getUTCHours();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (hour < 8) {
    d.setUTCDate(d.getUTCDate() - 1);
  }
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function buildCacheKey(world: string, dateStr: string): string {
  return `${BOSS_CHANCES_KEY_PREFIX}:${world}:${dateStr}`;
}

export async function fetchBossChances(world: string): Promise<{ date: string; data: BossChances }>{
  const date = getTargetDateUTC(new Date());
  const url = `https://raw.githubusercontent.com/ViniciusPaldes/tibia-bosses-tracker-chances/refs/heads/master/data/${encodeURIComponent(world)}/${date}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load boss chances: ${res.status}`);
  }
  const raw = await res.json();
  // Expect array of objects with full fields. Be defensive to support other shapes.
  let items: BossChances;
  if (Array.isArray(raw)) {
    items = (raw as any[]).map((r) => normalizeBoss(r));
  } else if (raw && typeof raw === 'object' && Array.isArray((raw as any).items)) {
    items = ((raw as any).items as any[]).map((r) => normalizeBoss(r));
  } else if (raw && typeof raw === 'object') {
    // object keyed by boss name → value can be chance or object
    items = Object.entries(raw as Record<string, any>).map(([name, value]) => {
      if (value && typeof value === 'object') {
        return normalizeBoss({ name, ...value });
      }
      return normalizeBoss({ name, chance: value as BossChanceLevel });
    });
  } else {
    items = [];
  }
  return { date, data: items };
}

const TTL_1_DAY_MS = 24 * 60 * 60 * 1000;

export async function getCachedBossChances(world: string): Promise<BossChances | null> {
  const date = getTargetDateUTC(new Date());
  return getWithTTL<BossChances>(buildCacheKey(world, date), TTL_1_DAY_MS);
}

export async function setCachedBossChances(world: string, date: string, data: BossChances): Promise<void> {
  await setWithTTL(buildCacheKey(world, date), data);
}

// Check if we already have boss chances cached for the current target date (08:00 UTC boundary)
export async function hasTodayBossChances(world: string): Promise<boolean> {
  const date = getTargetDateUTC(new Date());
  const cached = await getWithTTL<BossChances>(buildCacheKey(world, date), TTL_1_DAY_MS);
  return Array.isArray(cached) && cached.length > 0;
}

// Ensure today's chances exist in cache (08:10 cutoff); if missing, fetch and persist
export async function ensureBossChancesForToday(world: string): Promise<BossChances> {
  const cached = await getCachedBossChances(world);
  if (cached && cached.length) return cached;
  const { date, data } = await fetchBossChances(world);
  await setCachedBossChances(world, date, data);
  return data;
}

export function sortBossesByChance<T extends { chance?: BossChanceLevel }>(items: T[]): T[] {
  const order: Record<BossChanceLevel, number> = {
    high: 1,
    medium: 2,
    low: 3,
    'lost track': 4,
    'no chance': 5,
  };
  return [...items].sort((a, b) => {
    const ca = a.chance ? order[a.chance as BossChanceLevel] ?? 999 : 998;
    const cb = b.chance ? order[b.chance as BossChanceLevel] ?? 999 : 998;
    return ca - cb;
  });
}


