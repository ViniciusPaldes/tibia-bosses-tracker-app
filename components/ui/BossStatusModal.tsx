// components/ui/BossStatusModal.tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { loadSelectedWorld } from "@/data/worlds/hooks";
import { submitSighting } from "@/services/firestore";
import { useModals } from "@/state/modals";
import * as Haptics from 'expo-haptics';
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

  async function handleSubmit(status: 'spotted' | 'killed' | 'checked') {
    try {
      const world = await loadSelectedWorld();
      if (!world) throw new Error('Select a world first');
      await submitSighting({ world, bossName: bossStatus!.bossName, status });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      close("bossStatus");
    }
  }

  return (
    <Overlay onTouchEnd={() => close("bossStatus")}>
      <Dialog>
        <Title>Boss Status</Title>
        <Hint>What happened when you checked this boss? Choose an option below so we can update the records.</Hint>

        <Button variant="secondary" onPress={() => handleSubmit('spotted')}>
          <ButtonText>Boss Found – Notify Others</ButtonText>
        </Button>

        <Button
          variant="destructive"
          onPress={() => handleSubmit('killed')}
          style={{ marginTop: 8 }}
        >
          <ButtonText>Boss Defeated</ButtonText>
        </Button>

        <Button
          variant="primary"
          onPress={() => handleSubmit('checked')}
          style={{ marginTop: 8 }}
        >
          <ButtonText>No Boss Found</ButtonText>
        </Button>
      </Dialog>
    </Overlay>
  );
}
