import { Screen, SignIn } from '@/components'
import { useAuth } from '@/store/auth'
import { useState } from 'react'

export default function Onboarding() {
  const { user, initializing, signInWithGoogle } = useAuth()

  const handleGooglePress = async () => {
    await signInWithGoogle(world)
  }

  const [world, setWorld] = useState<string | null>(null)

  const canSignIn = !!world && world.length > 0 && !initializing && !user

  return (
    <Screen name="Sign In">
      <SignIn
        world={world}
        setWorld={setWorld}
        canSignIn={canSignIn}
        handleGooglePress={handleGooglePress}
      />
    </Screen>
  )
}
