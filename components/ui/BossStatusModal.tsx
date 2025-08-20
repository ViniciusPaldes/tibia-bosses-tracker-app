// components/ui/BossStatusModal.tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { loadSelectedWorld } from "@/data/worlds/hooks";
import { logAnalyticsEvent } from "@/services/analytics";
import { submitSighting } from "@/services/firestore";
import { captureException } from "@/services/sentry";
import { useModals } from "@/state/modals";
import * as Haptics from 'expo-haptics';
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import Toast from 'react-native-toast-message';
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
  const { t } = useTranslation('common');
  if (!visible) return null;

  async function handleSubmit(status: 'spotted' | 'killed' | 'checked') {
    try {
      const world = await loadSelectedWorld();
      if (!world) throw new Error('Select a world first');
      await submitSighting({ world, bossName: bossStatus!.bossName, status });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await logAnalyticsEvent('boss_status_updated', {
        world: world,
        bossName: bossStatus!.bossName,
        status: status,
      });
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: t('bossStatusSuccess'),
      });

    } catch (e) {
      captureException(e, 'components/ui/BossStatusModal:handleSubmit', { status, bossName: bossStatus?.bossName });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: t('bossStatusError'),
      });
    } finally {
      close("bossStatus");
    }
  }

  return (
    <Overlay onPress={() => close("bossStatus")}>
      <Dialog>
        <Title>{t('bossStatus')}</Title>
        <Hint>{t('bossStatusHint')}</Hint>

        <Button variant="secondary" onPress={() => handleSubmit('spotted')}>
          <ButtonText>{t('bossFoundNotifyOthers')}</ButtonText>
        </Button>

        <Button
          variant="destructive"
          onPress={() => handleSubmit('killed')}
          style={{ marginTop: 8 }}
        >
          <ButtonText>{t('bossDefeated')}</ButtonText>
        </Button>

        <Button
          variant="primary"
          onPress={() => handleSubmit('checked')}
          style={{ marginTop: 8 }}
        >
          <ButtonText>{t('noBossFound')}</ButtonText>
        </Button>
      </Dialog>
    </Overlay>
  );
}
