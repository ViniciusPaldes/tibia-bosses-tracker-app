// state/auth.tsx
import { setupUser } from '@/services/api/analytics'
import { auth } from '@/services/api/firebase'
import { configureGoogleSignin } from '@/services/api/googleSignin'
import { registerPushToken } from '@/services/api/push'
import { captureException, setSentryUser } from '@/services/api/sentry'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, User } from 'firebase/auth'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { Alert, Platform } from 'react-native'

type AuthContextValue = {
  user: User | null
  initializing: boolean
  signInWithGoogle: (world: string | null) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null)
      setInitializing(false)
      // Sentry user identification
      if (u) {
        setSentryUser({ id: u.uid, email: u.email ?? undefined })
      } else {
        setSentryUser(null)
      }
    })
    return () => unsub()
  }, [])

  // Configure Google Sign-In once on mount
  useEffect(() => {
    configureGoogleSignin()
  }, [])

  // Register push token when signed in
  useEffect(() => {
    if (!user) return
    registerPushToken(null).catch(() => {})
  }, [user])

  const signInWithGoogle = async (world: string | null) => {
    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      }
      const response = await GoogleSignin.signIn()
      if (!response.data?.idToken) throw new Error('No idToken from Google')
      const cred = GoogleAuthProvider.credential(response.data.idToken)
      await signInWithCredential(auth, cred)
      await setupUser(response.data.user.email, {
        world: world || '',
      })
    } catch (e: any) {
      if (e?.code === statusCodes.SIGN_IN_CANCELLED) return
      captureException(e, 'state/auth:signInWithGoogle')
      Alert.alert('Sign-in failed', 'Please try again.')
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
    } catch (e) {
      captureException(e, 'state/auth:signOut')
      throw e
    } finally {
      // Clear Sentry user when signing out
      setSentryUser(null)
    }
  }

  const value = useMemo(
    () => ({ user, initializing, signInWithGoogle, signOut }),
    [user, initializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
