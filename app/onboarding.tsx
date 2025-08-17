// app/onboarding.tsx
import { Button, ButtonText } from "@/components/ui/Button";
import SelectModal from "@/components/ui/SelectModal";
import { loadSelectedWorld, saveSelectedWorld, useWorlds } from "@/data/worlds/hooks";
import { useAuth } from "@/state/auth";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Animated, Dimensions } from "react-native";
import styled from "styled-components/native";

const { width, height } = Dimensions.get("window");

const Root = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.tokens.colors.backgroundDark, // fallback while image loads
}));

const BgImage = styled(Image)({
  position: "absolute",
  width,
  height,
  top: 0,
  left: 0,
});

const Dim = styled.View({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.45)", // subtle dark overlay for readability
});

const Container = styled(Animated.View)(({ theme }) => ({
  flex: 1,
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
  opacity: 0.98,
}));

const DropdownItem = styled.Pressable(() => ({
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
  const { t } = useTranslation('common');

  const [selected, setSelected] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // entry animation
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  // preload previously selected world
  useEffect(() => {
    loadSelectedWorld().then((w) => {
      if (w) setSelected(w);
    });
  }, []);

  const canSignIn = !!selected && !loading && worlds.length > 0 && !initializing && !user;

  return (
    <Root>
      {/* Replace the image path with your generated artwork */}
      <BgImage
        source={require("../assets/images/bg-onboarding.png")}
        contentFit="cover"
        transition={250}
      />
      <Dim />

      <Container
        style={{
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <Title>{t('appName')}</Title>

        <Dropdown>
          <Title style={{ fontSize: 16, marginBottom: 8 }}>{t('world')}:</Title>

          <DropdownText
            onPress={() => {
              if (!loading && !error) setPickerOpen(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Select world"
          >
            {loading ? t('loadingWorlds') : selected ?? t('selectWorld')}
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
            setSelected(w);
            await saveSelectedWorld(w);
          }}
          onClose={() => setPickerOpen(false)}
        />

        <Button variant="primary" onPress={() => handleGooglePress(signInWithGoogle)} disabled={!canSignIn}>
          <ButtonText>{t('signInWithGoogle')}</ButtonText>
        </Button>
      </Container>
    </Root>
  );
}