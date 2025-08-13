// app/bosses/index.tsx
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { getBossImageUrl } from "@/utils/images";
import { format } from "date-fns";
import { Image } from "expo-image";
import { Redirect, router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import { BossListItem } from "@/components/ui/BossListItem";
import { loadSelectedWorld, useBossChances } from "@/data/worlds/hooks";
import { useAuth } from "@/state/auth";
import { useModals } from "@/state/modals";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTheme } from "styled-components/native";

const TopBar = styled.View(() => ({
  flexDirection: "row",
  // RN suporta gap, mas alguns parsers do SC se perdem. Evitamos aqui.
  marginBottom: 12,
}));

const Search = styled.TextInput(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.tokens.colors.card,
  color: theme.tokens.colors.text,
  borderRadius: theme.tokens.radius,
  padding: 12,
}));

const Filter = styled.TouchableOpacity(({ theme }) => ({
  width: 44,
  height: 44,
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 8, // em vez de gap
}));

// Tipagem para o FlatList horizontal
const Horizontal = styled(FlatList as new () => FlatList<any>)(
  {}
) as unknown as typeof FlatList;

const BossName = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h3,
}));

const Chance = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.textSecondary,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  marginBottom: 8,
}));

const PageHeader = styled.View(({ theme }) => ({
  marginBottom: theme.tokens.spacing(2),
}));

const PageTitle = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h1,
  marginBottom: 4,
}));

const PageSubtitle = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.textSecondary,
  fontFamily: theme.tokens.typography.fonts.body,
  fontSize: theme.tokens.typography.sizes.caption,
}));

const BossRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
}));

const BossAvatar = styled(Image)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.tokens.radius,
  marginRight: theme.tokens.spacing(1.5),
  backgroundColor: theme.tokens.colors.card,
}));

const BossInfo = styled.View(() => ({
  flex: 1,
}));

const MOCK_KILLED = [
  { id: "draptor", name: "Draptor", chance: "High" },
  { id: "ghazbaran", name: "Ghazbaran", chance: "Low" },
];

const MOCK_LIST = [
  { id: "orkus", name: "Orshabaal", chancePercent: 72 },
  { id: "morg", name: "Morgaroth", chancePercent: 38 },
];

export const options = { title: "Bosses" };

export default function BossList() {
  const navigation = useNavigation();
  const theme = useTheme();
  const todayLabel = format(new Date(), "EEE, MMM d");
  const { user, initializing } = useAuth();
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);
  useEffect(() => {
    loadSelectedWorld().then((w) => setSelectedWorld(w));
  }, []);
  const { data: chances, loading: chancesLoading } = useBossChances(selectedWorld);

  const { open } = useModals();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Bosses",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => open('drawer', true)}
          style={{ paddingHorizontal: 8, paddingVertical: 4 }}
          accessibilityLabel="Open menu"
        >
          <Ionicons name="menu-outline" size={22} color={theme.tokens.colors.text} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.push("/filter")}
            style={{ marginRight: 16 }}
            accessibilityLabel="Open filter"
          >
            <Ionicons
              name="funnel-outline"
              size={22}
              color={theme.tokens.colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => open("timeline", true)}
            accessibilityLabel="Open timeline"
          >
            <Ionicons
              name="time-outline"
              size={22}
              color={theme.tokens.colors.text}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, theme, open]);
  if (initializing) return null;
  if (!user) return <Redirect href="/onboarding" />;
  return (
    <Screen>

      <TopBar>
        <Search placeholder="Search bosses..." placeholderTextColor="#888" />
      </TopBar>

      <FlatList
        data={chances.map((c) => ({ ...c, id: c.id ?? c.name }))}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={
          <View>
            <SectionTitle>Bosses Killed Yesterday</SectionTitle>
            <Horizontal
              data={MOCK_KILLED}
              keyExtractor={(i: any) => i.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }: any) => (
                <Card style={{ marginRight: 12, width: 200 }}>
                  <BossRow>
                    <BossAvatar
                      source={{ uri: getBossImageUrl(item.name) }}
                      contentFit="cover"
                    />
                    <BossInfo>
                      <BossName numberOfLines={1}>{item.name}</BossName>
                    </BossInfo>
                  </BossRow>
                </Card>
              )}
              style={{ marginBottom: 12 }}
            />
            <PageHeader>
              <PageTitle>Today’s Bosses</PageTitle>
              <PageSubtitle>{todayLabel}</PageSubtitle>
            </PageHeader>
          </View>
        }
        renderItem={({ item }) => (
          <BossListItem
            name={item.name}
            city={item.city}
            daysSince={item.daysSince}
            chance={(item.chance ?? 'low') as any}
            imageUrl={getBossImageUrl(item.name)}
            onPress={() =>
              router.push({
                pathname: '/bosses/[id]',
                params: { id: item.id, boss: JSON.stringify(item) },
              })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
