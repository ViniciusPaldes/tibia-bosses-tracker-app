// state/auth.tsx
import { auth } from '@/services/firebase';
import { registerPushToken } from '@/services/push';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, User } from 'firebase/auth';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  isGoogleReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  // Register push token when signed in
  useEffect(() => {
    if (!user) return;
    registerPushToken(null).catch(() => { });
  }, [user]);

  // Create a single request (must have correct client IDs set in env)
  const { googleOAuth } = (Constants.expoConfig?.extra ?? {}) as any;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      Platform.select({
        ios: googleOAuth.ios,
        android: googleOAuth.android,
        default: googleOAuth.web, // optional
      })!,
  });

  const isGoogleReady = !!request;

  // Handle the result from Google
  useEffect(() => {
    if (response?.type === 'success' && response.params?.id_token) {
      const cred = GoogleAuthProvider.credential(response.params.id_token);
      signInWithCredential(auth, cred).catch((e) => {
        console.warn('Firebase sign-in failed', e);
        Alert.alert('Sign-in failed', 'Please try again.');
      });
    }
  }, [response]);

  const signInWithGoogle = async () => {
    if (!request) return; // not ready yet
    await promptAsync();
  };

  const signOut = async () => auth.signOut();

  const value = useMemo(
    () => ({ user, initializing, isGoogleReady, signInWithGoogle, signOut }),
    [user, initializing, isGoogleReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}