import type { Timestamp } from 'firebase/firestore';

export type Sighting = {
  id: string;
  world: string;
  bossName: string;
  status: 'spotted' | 'killed' | 'checked';
  playerId: string;
  playerName?: string;
  coords?: string;
  note?: string;
  createdAt?: Timestamp; // serverTimestamp pending
  expiresAt: Timestamp;
};


