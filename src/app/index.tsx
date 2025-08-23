import { Screen, SignIn } from '@/components'
import { loadSelectedWorld, saveSelectedWorld, useWorlds } from '@/services/storage/worlds/hooks'
import { useAuth } from '@/store/auth'
import { useEffect, useState } from 'react'

export default function Onboarding() {
  const { user, initializing, signInWithGoogle } = useAuth()
  const { data: worlds, loading, error, refetch } = useWorlds()

  const handleGooglePress = async () => {
    await signInWithGoogle(selected)
  }

  const [selected, setSelected] = useState<string | null>(null)

  // preload previously selected world
  useEffect(() => {
    loadSelectedWorld().then((w) => {
      if (w) setSelected(w)
    })
  }, [])

  const canSignIn = !!selected && !loading && worlds.length > 0 && !initializing && !user

  return (
    <Screen name="Sign In">
      <SignIn
        worlds={worlds}
        loading={loading}
        error={error}
        selected={selected}
        setSelected={setSelected}
        refetch={refetch}
        canSignIn={canSignIn}
        saveSelectedWorld={saveSelectedWorld}
        handleGooglePress={handleGooglePress}
      />
    </Screen>
  )
}
