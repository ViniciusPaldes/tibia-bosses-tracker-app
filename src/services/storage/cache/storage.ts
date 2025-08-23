// storage.ts
import { captureException } from '@/services/api/sentry';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'app-cache' });

type CacheEntry<T> = { value: T; ts: number };

export async function setWithTTL<T>(key: string, value: T): Promise<void> {
  const entry: CacheEntry<T> = { value, ts: Date.now() };
  try {
    storage.set(key, JSON.stringify(entry));
  } catch (e) {
    captureException(e, 'data/cache/storage:setWithTTL', { key });
  }
}

export async function getWithTTL<T>(key: string, maxAgeMs: number): Promise<T | null> {
  try {
    const raw = storage.getString(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (typeof parsed?.ts !== 'number') return null;

    const age = Date.now() - parsed.ts;
    if (age > maxAgeMs) return null;

    return parsed.value as T;
  } catch (e) {
    captureException(e, 'data/cache/storage:getWithTTL', { key });
    return null;
  }
}