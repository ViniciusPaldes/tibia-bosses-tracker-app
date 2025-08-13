import AsyncStorage from '@react-native-async-storage/async-storage';

type CacheEntry<T> = { value: T; ts: number };

export async function setWithTTL<T>(key: string, value: T): Promise<void> {
  const entry: CacheEntry<T> = { value, ts: Date.now() };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
}

export async function getWithTTL<T>(key: string, maxAgeMs: number): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (typeof parsed?.ts !== 'number') return null;
    if (Date.now() - parsed.ts > maxAgeMs) return null;
    return parsed.value as T;
  } catch {
    return null;
  }
}


