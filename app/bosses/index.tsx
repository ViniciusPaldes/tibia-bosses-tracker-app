// app/bosses/index.tsx
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { getBossImageUrl } from "@/utils/images";
import { FlashList } from '@shopify/flash-list';
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import { BossListItem } from "@/components/ui/BossListItem";
import { BOSSES_FILTERS_KEY } from "@/data/cache/keys";
import { getWithTTL, setWithTTL } from "@/data/cache/storage";
import { useRecentSightings } from "@/data/sightings/hooks";
import { loadSelectedWorld, useBossChances } from "@/data/worlds/hooks";
import { formatDate } from "@/src/i18n/formats";
import { useAuth } from "@/state/auth";
import { useModals } from "@/state/modals";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTheme } from "styled-components/native";
const { width, height } = Dimensions.get("window");

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

const ChipRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: theme.tokens.spacing(1.5),
}));

const Chip = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 999,
  borderWidth: 1,
  marginRight: theme.tokens.spacing(1),
  marginBottom: theme.tokens.spacing(1),
  backgroundColor: theme.tokens.colors.card,
  borderColor: 'rgba(255,255,255,0.12)',
}));

const ChipText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.body,
  marginRight: 6,
}));


export const options = { title: "Bosses" };

export default function BossList() {
  const navigation = useNavigation();
  const theme = useTheme();

  const { user, initializing } = useAuth();
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);
  useEffect(() => {
    loadSelectedWorld().then((w) => setSelectedWorld(w));
  }, []);
  const { data: chances, loading: chancesLoading } = useBossChances(selectedWorld);
  const { killedSet } = useRecentSightings(selectedWorld, 200);
  const { i18n, t } = useTranslation('common');
  const todayLabel = formatDate(new Date(), i18n.language);
  const { open } = useModals();
  const [filters, setFilters] = useState<{ chance: 'low' | 'medium' | 'high' | null; city: string | null; search: string | null } | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  const handleOpenDrawer = useCallback(() => {
    if (__DEV__ === false) console.log('[ui] headerLeft pressed: open drawer');
    open('drawer', true);
  }, [open]);

  const handleOpenFilter = useCallback(() => {
    if (__DEV__ === false) console.log('[ui] headerRight pressed: open filter');
    router.push('/filter');
  }, []);

  const handleOpenTimeline = useCallback(() => {
    if (__DEV__ === false) console.log('[ui] headerRight pressed: open timeline');
    open('timeline', true);
  }, [open]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('titleBosses'),
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleOpenDrawer}
          style={{ paddingHorizontal: 8, paddingVertical: 4 }}
          accessibilityLabel={t('openMenu')}
        >
          <Ionicons name="menu-outline" size={22} color={theme.tokens.colors.text} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleOpenFilter}
            style={{ marginRight: 16 }}
            accessibilityLabel={t('openFilter')}
          >
            <Ionicons
              name="funnel-outline"
              size={22}
              color={theme.tokens.colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenTimeline}
            accessibilityLabel={t('openTimeline')}
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
  }, [navigation, theme, t, handleOpenDrawer, handleOpenFilter, handleOpenTimeline]);
  const loadFilters = useCallback(async () => {
    const saved = await getWithTTL<any>(BOSSES_FILTERS_KEY, Number.MAX_SAFE_INTEGER);
    setFilters({
      chance: (saved?.chance as any) ?? null,
      city: typeof saved?.city === 'string' ? saved.city : null,
      search: typeof saved?.search === 'string' && saved.search.trim() ? saved.search : null,
    });
    setSearchInput(typeof saved?.search === 'string' ? saved.search : "");
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFilters();
    }, [loadFilters])
  );
  if (initializing) return null;

  const killedYesterday = chances.filter((c) => c.daysSince === 1);
  const killedYesterdayData = killedYesterday.map((c) => ({ ...c, id: c.id ?? c.name }));
  const filteredChances = useMemo(() => {
    let list = chances;
    if (filters?.chance) {
      list = list.filter((i) => (i.chance?.toLowerCase?.() ?? '') === filters.chance);
    }
    if (filters?.city) {
      list = list.filter((i) => i.city === filters.city);
    }
    if (filters?.search && filters.search.trim()) {
      const s = filters.search.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(s));
    }
    return list;
  }, [chances, filters]);

  const removeFilter = useCallback(async (key: 'chance' | 'city' | 'search') => {
    const saved = await getWithTTL<any>(BOSSES_FILTERS_KEY, Number.MAX_SAFE_INTEGER);
    const next = { ...(saved ?? {}), [key]: null } as any;
    if (key === 'search') next.search = null;
    await setWithTTL(BOSSES_FILTERS_KEY, next);
    await loadFilters();
  }, [loadFilters]);
  return (
    <Screen>
      <TopBar>
        <Search
          placeholder={t('searchBosses')}
          placeholderTextColor="#888"
          value={searchInput}
          onChangeText={setSearchInput}
          returnKeyType="search"
          onSubmitEditing={async () => {
            const term = searchInput.trim();
            const saved = await getWithTTL<any>(BOSSES_FILTERS_KEY, Number.MAX_SAFE_INTEGER);
            await setWithTTL(BOSSES_FILTERS_KEY, {
              ...(saved ?? {}),
              search: term.length ? term : null,
            });
            await loadFilters();
          }}
        />
      </TopBar>

      {filters && (filters.chance || filters.city || (filters.search && filters.search.trim())) ? (
        <ChipRow>
          {filters.search && (
            <Chip onPress={() => removeFilter('search')}>
              <ChipText>{t('search')}: {filters.search}</ChipText>
              <Ionicons name="close" size={16} color={theme.tokens.colors.text} />
            </Chip>
          )}
          {filters.chance && (
            <Chip onPress={() => removeFilter('chance')}>
              <ChipText>
                {t('chance')}: {
                  filters.chance === 'low'
                    ? 'Low'
                    : filters.chance === 'medium'
                      ? 'Mid'
                      : filters.chance === 'high'
                        ? 'High'
                        : filters.chance === 'no chance'
                          ? 'No Chance'
                          : 'Lost Track'
                }
              </ChipText>
              <Ionicons name="close" size={16} color={theme.tokens.colors.text} />
            </Chip>
          )}
          {filters.city && (
            <Chip onPress={() => removeFilter('city')}>
              <ChipText>{t('city')}: {filters.city}</ChipText>
              <Ionicons name="close" size={16} color={theme.tokens.colors.text} />
            </Chip>
          )}
        </ChipRow>
      ) : null}

      <FlashList
        data={filteredChances.map((c) => ({ ...c, id: c.id ?? c.name }))}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={
          <View>
            {killedYesterdayData.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <SectionTitle>{t('bossesKilledYesterday')}</SectionTitle>
                <Horizontal
                  data={killedYesterdayData}
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
              </View>
            )}
            <PageHeader>
              <PageTitle>{t('todaysBosses')}</PageTitle>
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
            killed={killedSet?.has?.(item.name)}
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
