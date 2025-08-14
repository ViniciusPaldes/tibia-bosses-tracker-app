// app/bosses/[id].tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";

import { BossListItem } from "@/components/ui/BossListItem";
import { LootRow } from "@/components/ui/LootRow";
import StaticTibiaMap from "@/components/ui/StaticTibiaMap";
import type { BossChanceItem, BossChanceLevel } from "@/data/chances";
import { useAuth } from "@/state/auth";
import { useModals } from "@/state/modals";
import { getBossImageUrl } from "@/utils/images";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";


const Section = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 12,
  marginBottom: 12,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontSize: theme.tokens.typography.sizes.h3,
  fontFamily: theme.tokens.typography.fonts.title,
  fontWeight: 'bold',
  marginBottom: 8,
}));

const Badge = styled.Text<{ level: BossChanceLevel | undefined }>(({ theme, level }) => {
  const map: Record<string, string> = {
    high: theme.tokens.colors.success,
    medium: theme.tokens.colors.warning,
    low: '#7a7a7a',
    'lost track': "#555",
    'no chance': theme.tokens.colors.danger,
  } as const;
  const bg = (level && map[level]) || theme.tokens.colors.backgroundDark;
  return {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.tokens.radius,
    backgroundColor: bg,
    overflow: 'hidden',
    color: '#111',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 12,
  } as any;
});

const FloatingLabel = styled(Animated.View)(({ theme }) => ({
  marginTop: 8,
  alignSelf: 'center',
  backgroundColor: 'rgba(0,0,0,0.7)',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 999,
}));

const FloatingLabelText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontSize: 12,
}));

export default function BossDetail() {
  const { boss, id } = useLocalSearchParams<{ boss?: string; id?: string }>();
  const navigation = useNavigation();
  const { user, initializing } = useAuth();

  const parsed: BossChanceItem | null = useMemo(() => {
    try {
      return boss ? (JSON.parse(boss) as BossChanceItem) : null;
    } catch {
      return null;
    }
  }, [boss]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Boss Detail" });
  }, [parsed, id, navigation]);

  const [labelText, setLabelText] = useState("");
  const labelOpacity = useSharedValue(0);
  const labelTranslate = useSharedValue(8);

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ translateY: labelTranslate.value }],
  }));

  const handleSelect = (name: string | null) => {
    if (!name) {
      labelOpacity.value = withTiming(0, { duration: 150 });
      labelTranslate.value = withTiming(8, { duration: 150 });
      return;
    }
    // cross-fade update
    labelOpacity.value = withTiming(0, { duration: 90 });
    setLabelText(name);
    labelOpacity.value = withTiming(1, { duration: 180 });
    labelTranslate.value = withTiming(0, { duration: 180 });
  };

  if (!parsed) return null;
  return (
    initializing ? null : !user ? (
      <Redirect href="/onboarding" />
    ) : (
      <Screen scrollable>
        <BossListItem
          name={parsed.name}
          chance={parsed.chance}
          imageUrl={getBossImageUrl(parsed.name)}
          onPress={() => { }}
          city={parsed.city}
          daysSince={parsed.daysSince}
        />
        <Section>
          <SectionTitle>Location</SectionTitle>
          {parsed?.location?.length ? (
            <>
              {parsed.location.map((coord, idx) => (
                <View key={`${coord}-${idx}`} style={{ marginBottom: 8 }}>
                  <StaticTibiaMap coord={coord} height={250} />
                </View>
              ))}
            </>
          ) : (
            <Text style={{ color: "#b0b0b0" }}>Unknown</Text>
          )}
        </Section>

        <Section>
          <SectionTitle>Last sightings</SectionTitle>
          
        </Section>

        <Section>
          <SectionTitle>Notable Loot</SectionTitle>
          {parsed?.loots?.length ? (
            <>
              <LootRow items={parsed.loots} onSelect={handleSelect} />
              <FloatingLabel
                style={labelStyle}
                accessibilityLiveRegion="polite"
                accessible
              >
                <FloatingLabelText>{labelText}</FloatingLabelText>
              </FloatingLabel>
            </>
          ) : (
            <Text style={{ color: "#b0b0b0", textAlign: 'center' }}>None</Text>
          )}
        </Section>

        <Button
          variant="primary"
          onPress={() =>
            useModals
              .getState()
              .open("bossStatus", { bossId: parsed?.id ?? (parsed?.name ?? 'unknown'), bossName: parsed?.name ?? 'Unknown' })
          }
        >
          <ButtonText>Check this Boss</ButtonText>
        </Button>
      </Screen>
    )
  );
}
