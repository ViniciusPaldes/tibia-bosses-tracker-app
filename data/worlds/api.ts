import type { WorldsAPI } from './types';

const BASE_URL = 'https://api.tibiadata.com/v4';

export async function fetchWorlds(): Promise<WorldsAPI> {
  const res = await fetch(`${BASE_URL}/worlds`);
  if (!res.ok) {
    throw new Error(`Failed to load worlds: ${res.status}`);
  }
  return (await res.json()) as WorldsAPI;
}


