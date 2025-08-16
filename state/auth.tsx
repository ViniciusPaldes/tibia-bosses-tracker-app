// state/auth.tsx
import { auth } from '@/services/firebase';
import { configureGoogleSignin } from '@/services/googleSignin';
import { registerPushToken } from '@/services/push';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, User } from 'firebase/auth';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
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

  // Configure Google Sign-In once on mount
  useEffect(() => {
    configureGoogleSignin();
  }, []);

  // Register push token when signed in
  useEffect(() => {
    if (!user) return;
    registerPushToken(null).catch(() => { });
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }
      const response = await GoogleSignin.signIn();
      if (!response.data?.idToken) throw new Error('No idToken from Google');
      const cred = GoogleAuthProvider.credential(response.data.idToken);
      await signInWithCredential(auth, cred);
    } catch (e: any) {
      if (e?.code === statusCodes.SIGN_IN_CANCELLED) return;
      console.warn('Google sign-in failed', e);
      Alert.alert('Sign-in failed', 'Please try again.');
    }
  };

  const signOut = async () => auth.signOut();

  const value = useMemo(
    () => ({ user, initializing, signInWithGoogle, signOut }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}