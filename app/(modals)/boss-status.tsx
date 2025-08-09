// app/(modals)/boss-status.tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { router } from "expo-router";
import styled from "styled-components/native";

const Overlay = styled.View(() => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  alignItems: "center",
  justifyContent: "center",
}));

const Dialog = styled.View(({ theme }) => ({
  width: "88%",
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 16,
}));

const Title = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h3,
  textAlign: "center",
  marginBottom: 8,
}));

const Hint = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.textSecondary,
  textAlign: "center",
  marginBottom: 12,
}));

export default function BossStatusModal() {
  return (
    <Overlay onTouchEnd={() => router.back()}>
      <Dialog>
        <Title>Boss Killed?</Title>
        <Hint>Choose how to update this boss status.</Hint>

        <Button variant="secondary" onPress={() => router.back()}>
          <ButtonText>Notify Others</ButtonText>
        </Button>

        <Button
          variant="destructive"
          onPress={() => router.back()}
          style={{ marginTop: 8 }}
        >
          <ButtonText>Mark as Dead</ButtonText>
        </Button>

        <Button
          variant="primary"
          onPress={() => router.back()}
          style={{ marginTop: 8 }}
        >
          <ButtonText>Mark as Watched</ButtonText>
        </Button>
      </Dialog>
    </Overlay>
  );
}