// app/bosses/[id].tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import styled from "styled-components/native";

import StaticTibiaMap from "@/components/ui/StaticTibiaMap";
import type { BossChanceItem, BossChanceLevel } from "@/data/chances";
import { useAuth } from "@/state/auth";
import { useModals } from "@/state/modals";
import { getLootImageUrl } from "@/utils/images";
import { Image } from "expo-image";


const Section = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 12,
  marginBottom: 12,
}));

const Badge = styled.Text<{ level: BossChanceLevel | undefined }>(({ theme, level }) => {
  const map: Record<string, string> = {
    high: theme.tokens.colors.success,
    medium: theme.tokens.colors.warning,
    low: '#7a7a7a',
    'Lost Track': "#555",
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

const LootImage = styled(Image)(({ theme }) => ({
  width: 48,
  height: 48,
  marginHorizontal: 8,
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
    navigation.setOptions({ title: parsed?.name ?? id ?? "Boss Detail" });
  }, [parsed, id, navigation]);

  return (
    initializing ? null : !user ? (
      <Redirect href="/onboarding" />
    ) : (
      <Screen scrollable>
        <Section>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: "#fff", fontSize: 18 }}>{parsed?.city ?? 'Unknown'}</Text>
            <Badge level={parsed?.chance as BossChanceLevel}>{parsed?.chance ?? 'Unknown'}</Badge>
          </View>
        </Section>

        <Section>
          <Text style={{ color: "#fff", marginBottom: 6 }}>Location</Text>
          {parsed?.location?.length ? (
            <>
              {parsed.location.map((coord, idx) => (
                <View key={`${coord}-${idx}`} style={{ marginBottom: 8 }}>
                  <Text style={{ color: "#b0b0b0", marginBottom: 6 }}>{coord}</Text>
                  <StaticTibiaMap coord={coord} height={250} />
                </View>
              ))}
            </>
          ) : (
            <Text style={{ color: "#b0b0b0" }}>Unknown</Text>
          )}
        </Section>

        <Section>
          <Text style={{ color: "#fff", marginBottom: 6 }}>Last seen</Text>
          <Text style={{ color: "#b0b0b0" }}>
            {parsed?.lastSeen ?? 'Unknown'}{typeof parsed?.daysSince === 'number' ? ` • ${parsed?.daysSince} days ago` : ''}
          </Text>
        </Section>

        <Section>
          <Text style={{ color: "#fff", marginBottom: 6, textAlign: 'center' }}>Loot</Text>
          {parsed?.loots?.length ? (
            <FlatList
              data={parsed.loots}
              keyExtractor={(i) => i}
              renderItem={({ item }) => (
                <View style={{ alignItems: 'center' }}>
                  <LootImage
                    source={{ uri: getLootImageUrl(item) }}
                    contentFit="contain"
                    accessibilityLabel={item}
                  />
                  <Text style={{ color: '#b0b0b0', marginTop: 4 }}>{item}</Text>
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            />
          ) : (
            <Text style={{ color: "#b0b0b0", textAlign: 'center' }}>Unknown</Text>
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
          <ButtonText>Mark as Watched</ButtonText>
        </Button>
      </Screen>
    )
  );
}
