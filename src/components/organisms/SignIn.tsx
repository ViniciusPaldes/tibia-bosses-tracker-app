import { WorldDropdown } from '@/components/molecules'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components/native'
import { ANIM_TYPES, AnimatedContainer, Button, ButtonText, ImageBackground } from '../atoms'

const signInBackground = require('../../../assets/images/bg-onboarding.png')

interface SignInProps {
  /**
   * The selected world.
   */
  world: string | null
  /**
   * The function to set the selected world.
   */
  setWorld: (world: string | null) => void
  /**
   * Whether the user can sign in.
   */
  canSignIn: boolean
  /**
   * The function to handle the Google sign in.
   */
  handleGooglePress: () => Promise<void>
}

export function SignIn({ world, setWorld, canSignIn, handleGooglePress }: SignInProps) {
  const { t } = useTranslation('common')

  return (
    <Root>
      <ImageBackground source={signInBackground}>
        <AnimatedContainer type={ANIM_TYPES.FADE_IN} duration={1500}>
          <Title>{t('appName')}</Title>

          <WorldDropdown world={world} setWorld={setWorld} />

          <Button variant="primary" onPress={() => handleGooglePress()} disabled={!canSignIn}>
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
