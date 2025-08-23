import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components/native'
import { ANIM_TYPES, AnimatedContainer, Button, ButtonText, ImageBackground } from '../atoms'
import { SelectModal } from './SelectModal'

const signInBackground = require('../../../assets/images/bg-onboarding.png')

interface SignInProps {
  worlds: string[]
  loading: boolean
  error: string | null
  selected: string | null
  setSelected: (world: string | null) => void
  refetch: () => void
  canSignIn: boolean
  saveSelectedWorld: (world: string) => Promise<void>
  handleGooglePress: (world: string | null) => Promise<void>
}

export function SignIn({
  worlds,
  loading,
  error,
  selected,
  setSelected,
  refetch,
  canSignIn,
  saveSelectedWorld,
  handleGooglePress,
}: SignInProps) {
  const { t } = useTranslation('common')
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <Root>
      <ImageBackground source={signInBackground}>
        <AnimatedContainer type={ANIM_TYPES.FADE_IN} duration={1500}>
          <Title>{t('appName')}</Title>

          <Dropdown>
            <Title style={{ fontSize: 16, marginBottom: 8 }}>{t('world')}:</Title>

            <DropdownText
              onPress={() => {
                if (!loading && !error) setPickerOpen(true)
              }}
              accessibilityRole="button"
              accessibilityLabel="Select world"
            >
              {loading ? t('loadingWorlds') : (selected ?? t('selectWorld'))}
            </DropdownText>

            {!!error && (
              <>
                <ErrorText>{error}</ErrorText>
                <DropdownItem onPress={refetch}>
                  <DropdownText>{t('retry')}</DropdownText>
                </DropdownItem>
              </>
            )}
          </Dropdown>

          <SelectModal
            visible={pickerOpen}
            title={t('chooseWorld')}
            data={worlds}
            onSelect={async (w) => {
              setSelected(w)
              await saveSelectedWorld(w)
            }}
            onClose={() => setPickerOpen(false)}
          />

          <Button
            variant="primary"
            onPress={() => handleGooglePress(selected)}
            disabled={!canSignIn}
          >
            <ButtonText>{t('signInWithGoogle')}</ButtonText>
          </Button>
        </AnimatedContainer>
      </ImageBackground>
    </Root>
  )
}

const Root = styled.View({
  flex: 1,
})

const Title = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h1,
  textAlign: 'center',
  marginBottom: 24,
}))

const Dropdown = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 12,
  marginBottom: 16,
  opacity: 0.98,
}))

const DropdownItem = styled.Pressable(() => ({
  paddingVertical: 10,
}))

const DropdownText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h3,
}))

const ErrorText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.danger,
  marginTop: 8,
}))
