import { app, auth } from '@/services/firebase';
import {
    addDoc,
    collection,
    getFirestore,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';

export type SightingStatus = 'spotted' | 'killed' | 'checked';

export type SubmitSightingInput = {
  world: string;
  bossName: string;
  status: SightingStatus;
  note?: string;
};

export const db = getFirestore(app);
export { Timestamp };

// Simple in-memory rate limiter (per app session)
const lastSubmitByKey: Record<string, number> = {};

export async function submitSighting(input: SubmitSightingInput): Promise<string> {
  const { world, bossName, status, note } = input;

  if (!world || !bossName) {
    throw new Error('Missing required fields: world and bossName');
  }

  const allowed: SightingStatus[] = ['spotted', 'killed', 'checked'];
  if (!allowed.includes(status)) {
    throw new Error('Invalid status');
  }

  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('User not authenticated');
  }

  const key = `${uid}:${bossName}`;
  const now = Date.now();
  const last = lastSubmitByKey[key] || 0;
  if (now - last < 5000) {
    throw new Error('Please wait a few seconds before submitting again');
  }

  const expiresAt = Timestamp.fromMillis(now + 24 * 60 * 60 * 1000);

  const playerName = auth.currentUser?.displayName || (auth.currentUser?.email ? auth.currentUser.email.split('@')[0] : undefined);

  console.log('submitSighting', { world, bossName, status, note, playerName, uid });
  const docRef = await addDoc(collection(db, 'sightings'), {
    world,
    bossName,
    status,
    note: note || null,
    playerId: uid,
    playerName,
    createdAt: serverTimestamp(),
    expiresAt,
  });

  lastSubmitByKey[key] = now;
  return docRef.id;
}


