import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

initializeApp();
const db = getFirestore();

type Sighting = {
  world: string;
  bossName: string;
  status: 'spotted' | 'killed' | 'checked';
  playerName?: string;
  createdAt?: FirebaseFirestore.Timestamp;
};

const seenDocIds = new Set<string>();

export const sendSightingNotifications = functions.firestore
  .document('sightings/{id}')
  .onCreate(async (snap) => {
    const id = snap.id;
    if (seenDocIds.has(id)) return;
    seenDocIds.add(id);

    const data = snap.data() as Sighting;
    if (!data || data.status !== 'spotted') return;
    const { world, bossName, playerName } = data;
    if (!world || !bossName) return;

    // Query users in the same world with valid tokens
    const usersSnap = await db.collection('users').where('currentWorld', '==', world).get();
    const tokens: string[] = [];
    usersSnap.forEach((doc) => {
      const t = doc.get('pushToken');
      if (typeof t === 'string' && t.startsWith('ExponentPushToken')) tokens.push(t);
    });
    if (tokens.length === 0) return;

    const messages = tokens.map((to) => ({
      to,
      title: 'Boss Found!',
      sound: 'default',
      body: `${bossName} was sighted in ${world} by ${playerName || 'someone'}`,
      data: { world, bossName, status: 'spotted' },
      channelId: 'alerts',
      priority: 'high',
    }));

    // Expo push API supports chunking, but for simplicity send in one request if small
    const chunks: any[] = [];
    const size = 90; // under Expo's 100 limit
    for (let i = 0; i < messages.length; i += size) chunks.push(messages.slice(i, i + size));

    for (const chunk of chunks) {
      try {
        const res = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chunk),
        });
        const json = await res.json();
        functions.logger.info('Expo push result', json);
      } catch (e) {
        functions.logger.error('Expo push send failed', e);
      }
    }
  });


