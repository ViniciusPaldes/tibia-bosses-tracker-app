// app/bosses/[id].tsx
import { BossListItem, Button, ButtonText, LootRow, Map, Screen, SightingListItem } from "@/components";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";

import type { BossChanceItem } from "@/services/storage/chances";
import { useRecentSightings } from "@/services/storage/sightings/hooks";
import { loadSelectedWorld } from "@/services/storage/worlds/hooks";
import { useAuth } from "@/store/auth";
import { useModals } from "@/store/modals";
import { getBossImageUrl } from "@/utils/images";
import { useTranslation } from "react-i18next";
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
  marginBottom: 8,
}));

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
  const { user, initializing } = useAuth();
  const { t } = useTranslation('common');
  const parsed: BossChanceItem | null = useMemo(() => {
    try {
      return boss ? (JSON.parse(boss) as BossChanceItem) : null;
    } catch {
      return null;
    }
  }, [boss]);


  const [labelText, setLabelText] = useState("");
  const labelOpacity = useSharedValue(0);
  const labelTranslate = useSharedValue(8);
  const [world, setWorld] = useState<string | null>(null);
  const { data: recent } = useRecentSightings(world, 10);

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

  // Load current world to filter recent sightings
  useLayoutEffect(() => {
    loadSelectedWorld().then(setWorld);
  }, []); 

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ title: t('titleBossDetail') });
  }, [navigation]);

  if (!parsed) return null;

  
  return (
    initializing ? null : !user ? (
      <Redirect href="/onboarding" />
    ) : (
      <Screen scrollable name="BossDetail">
        <BossListItem
          name={parsed.name}
          chance={parsed.chance}
          imageUrl={getBossImageUrl(parsed.name)}
          onPress={() => { }}
          city={parsed.city}
          daysSince={parsed.daysSince}
          killed={Boolean(recent?.find((s) => s.bossName === parsed.name && s.status === 'killed'))}
        />
        <Section>
          <SectionTitle>{t('location')}</SectionTitle>
          {parsed?.location?.length ? (
            <>
              {parsed.location.map((coord, idx) => (
                <View key={`${coord}-${idx}`} style={{ marginBottom: 8 }}>
                  <Map coord={coord} height={250} />
                </View>
              ))}
            </>
          ) : (
            <Text style={{ color: "#b0b0b0" }}>Unknown</Text>
          )}
        </Section>

        <Section>
          <SectionTitle>{t('lastSightings')}</SectionTitle>
          {recent?.length ? (
            recent
              .filter((s) => s.bossName === parsed.name)
              .slice(0, 5)
              .map((s) => (
                <SightingListItem
                  key={s.id}
                  status={s.status as any}
                  title={s.playerName ?? 'Someone'}
                  subtitle={s.createdAt ? new Date(s.createdAt.toDate?.() ?? Date.now()).toLocaleTimeString() : 'just now'}
                />
              ))
          ) : (
            <Text style={{ color: '#b0b0b0' }}>{t('noRecentReports')}</Text>
          )}
        </Section>

        <Section>
          <SectionTitle>{t('notableLoot')}</SectionTitle>
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
            <Text style={{ color: "#b0b0b0", textAlign: 'center' }}>{t('none')}</Text>
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
          <ButtonText>{t('checkThisBoss')}</ButtonText>
        </Button>
      </Screen>
    )
  );
}
