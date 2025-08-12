// data/repo/bossRepo.ts
import { BOSSES, SIGHTINGS } from '../seed';

export function listRecentSightings(limit = 20) {
  // join sighting with boss name
  const byTime = [...SIGHTINGS].sort((a, b) => b.at.getTime() - a.at.getTime());
  const take = byTime.slice(0, limit).map((s) => {
    const boss = BOSSES.find((b) => b.id === s.bossId);
    return {
      id: s.id,
      at: s.at,
      player: s.player,
      status: s.status,
      bossId: s.bossId,
      bossName: boss?.name ?? s.bossId,
    };
  });
  return Promise.resolve(take);
}