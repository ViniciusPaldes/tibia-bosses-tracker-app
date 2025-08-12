import { Button, ButtonText } from "@/components/ui/Button";
import { useAuth } from "@/state/auth";
import { router } from 'expo-router';
import styled from "styled-components/native";

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.tokens.colors.backgroundDark,
  padding: 24,
  justifyContent: "center",
}));

const Title = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h1,
  textAlign: "center",
  marginBottom: 24,
}));

const Dropdown = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 16,
  marginBottom: 16,
}));

const handleGooglePress = async (signInWithGoogle: () => Promise<void>) => {
  await signInWithGoogle();
  router.replace('/bosses');
};

export default function Onboarding() {
  const { signInWithGoogle, isGoogleReady } = useAuth();
  return (
    <Container>
      <Title>Tibia Boss Tracker</Title>
      <Dropdown>
        <Title style={{ fontSize: 16, marginBottom: 0 }}>World: Venebra</Title>
      </Dropdown>
      <Button variant="primary" onPress={() => handleGooglePress(signInWithGoogle)}
        disabled={!isGoogleReady}>
        <ButtonText>Sign in with Google</ButtonText>
      </Button>
    </Container>
  );
}
