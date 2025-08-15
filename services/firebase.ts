// services/firebase.native.ts (Android/iOS)
import Constants from 'expo-constants';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { MMKV } from 'react-native-mmkv';

// --- Config from app.config.ts -> extra.firebase
const cfg = (Constants.expoConfig?.extra as any)?.firebase;
if (!cfg) throw new Error('Missing Firebase config in app.config.ts (extra.firebase)');

// --- App singleton
const app: FirebaseApp = getApps().length ? getApps()[0]! : initializeApp(cfg);

// --- MMKV instance just for auth persistence
const mmkv = new MMKV({ id: 'auth' });

// Wrap MMKV with the AsyncStorage-like interface Auth expects
const mmkvPersistence = {
  getItem: (key: string) => Promise.resolve(mmkv.getString(key) ?? null),
  setItem: (key: string, value: string) => {
    mmkv.set(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    mmkv.delete(key);
    return Promise.resolve();
  },
};

// --- Auth singleton using MMKV persistence
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(mmkvPersistence),
});

export { app };
