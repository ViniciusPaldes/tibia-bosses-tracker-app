// components/ui/BossStatusModal.tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { useModals } from "@/state/modals";
import { Pressable } from "react-native";
import styled from "styled-components/native";

const Overlay = styled(Pressable)(() => ({
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
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
  const { modals, close } = useModals();
  const bossStatus = modals.bossStatus;
  const visible = !!bossStatus;

  if (!visible) return null;

  return (
    <Overlay onTouchEnd={() => close("bossStatus")}>
      <Dialog>
        <Title>Boss Killed?</Title>
        <Hint>Choose how to update this boss status.</Hint>

        <Button variant="secondary" onPress={() => close("bossStatus")}>
          <ButtonText>Notify Others</ButtonText>
        </Button>

        <Button
          variant="destructive"
          onPress={() => close("bossStatus")}
          style={{ marginTop: 8 }}
        >
          <ButtonText>Mark as Dead</ButtonText>
        </Button>

        <Button
          variant="primary"
          onPress={() => close("bossStatus")}
          style={{ marginTop: 8 }}
        >
          <ButtonText>Mark as Watched</ButtonText>
        </Button>
      </Dialog>
    </Overlay>
  );
}
