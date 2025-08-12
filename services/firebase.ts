// services/firebase.native.ts  (Android/iOS only)
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';

// Read from app.config.ts -> extra.firebase
const cfg = (Constants.expoConfig?.extra as any)?.firebase;
if (!cfg) {
  throw new Error('Missing Firebase config in app.config.ts (extra.firebase)');
}

// Singletons
const app: FirebaseApp = getApps().length ? getApps()[0]! : initializeApp(cfg);

// RN must use initializeAuth exactly once
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app };
