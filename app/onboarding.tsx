import { Button, ButtonText } from "@/components/ui/Button";
import SelectModal from "@/components/ui/SelectModal";
import { loadSelectedWorld, saveSelectedWorld, useWorlds } from '@/data/worlds/hooks';
import { useAuth } from "@/state/auth";
import { useEffect, useState } from 'react';
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
  padding: 12,
  marginBottom: 16,
}));

const DropdownItem = styled.Pressable(({ theme }) => ({
  paddingVertical: 10,
}));

const DropdownText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h3,
}));

const ErrorText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.danger,
  marginTop: 8,
}));

const handleGooglePress = async (signInWithGoogle: () => Promise<void>) => {
  await signInWithGoogle();
};
export default function Onboarding() {
  const { user, initializing, signInWithGoogle } = useAuth();
  const { data: worlds, loading, error, refetch } = useWorlds();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    loadSelectedWorld().then((w) => { if (w) setSelected(w); });
  }, []);

  const canSignIn = !!selected && !loading && worlds.length > 0 && !initializing && !user;

  return (
    <Container>
      <Title>Tibia Bosses Tracker</Title>
      
      <Dropdown>
        <Title style={{ fontSize: 16, marginBottom: 8 }}>World:</Title>

        <DropdownText
          onPress={() => { if (!loading && !error) setPickerOpen(true); }}
          accessibilityRole="button"
          accessibilityLabel="Select world"
        >
          {loading ? 'Loading worlds…' : selected ?? 'Select world'}
        </DropdownText>

        {!!error && (
          <>
            <ErrorText>{error}</ErrorText>
            <DropdownItem onPress={refetch}>
              <DropdownText>Retry</DropdownText>
            </DropdownItem>
          </>
        )}
      </Dropdown>

      <SelectModal
        visible={pickerOpen}
        title="Choose your world"
        data={worlds}
        onSelect={async (w) => { setSelected(w); await saveSelectedWorld(w); }}
        onClose={() => setPickerOpen(false)}
      />
      
      <Button variant="primary" onPress={() => handleGooglePress(signInWithGoogle)}
        disabled={!canSignIn}>
        <ButtonText>Sign in with Google</ButtonText>
      </Button>
    </Container>
  );
}
