import { Button, ButtonText } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { BOSSES_FILTERS_KEY } from "@/data/cache/keys";
import { getWithTTL, setWithTTL } from "@/data/cache/storage";
import { getCachedBossChances } from "@/data/chances";
import { loadSelectedWorld } from "@/data/worlds/hooks";
import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";

const Section = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: theme.tokens.spacing(2),
  marginBottom: theme.tokens.spacing(2),
}));

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h3,
  marginBottom: theme.tokens.spacing(1),
}));

const ChipRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
}));

const Chip = styled.TouchableOpacity<{
  selected?: boolean;
}>(({ theme, selected }) => ({
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 999,
  borderWidth: 1,
  marginRight: theme.tokens.spacing(1),
  marginBottom: theme.tokens.spacing(1),
  backgroundColor: selected
    ? theme.tokens.colors.primary
    : theme.tokens.colors.card,
  borderColor: selected
    ? theme.tokens.colors.primary
    : "rgba(255,255,255,0.12)",
}));

const ChipText = styled.Text<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? '#000' : theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.body,
}));

type ChanceLabel = "Low" | "Mid" | "High" | "Lost Track" | "No Chance";

export default function FilterScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation('common');
  const [chance, setChance] = useState<ChanceLabel | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('filter') });
  }, [navigation]);

  // Load persisted filters and dynamic cities
  useEffect(() => {
    (async () => {
      const saved = await getWithTTL<any>(BOSSES_FILTERS_KEY, Number.MAX_SAFE_INTEGER);
      if (saved) {
        const savedChance: string | null = saved?.chance ?? null;
        setChance(
          savedChance === 'low' ? 'Low' : savedChance === 'medium' ? 'Mid' : savedChance === 'high' ? 'High' : null
        );
        setCity(typeof saved?.city === 'string' ? saved.city : null);
      }

      const world = await loadSelectedWorld();
      if (world) {
        const cached = await getCachedBossChances(world);
        if (cached && cached.length) {
          const unique = Array.from(new Set(cached.map((b) => b.city).filter((c): c is string => !!c)));
          unique.sort((a, b) => a.localeCompare(b));
          setCities(unique);
        }
      }
    })();
  }, []);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Section>
          <SectionTitle>{t('chance')}</SectionTitle>
          <ChipRow>
            {["Low", "Mid", "High", "Lost Track", "No Chance"].map((c) => (
              <Chip
                key={c}
                selected={chance === (c as any)}
                onPress={() => setChance(chance === (c as any) ? null : (c as any))}
              >
                <ChipText selected={chance === (c as any)}>{c}</ChipText>
              </Chip>
            ))}
          </ChipRow>
        </Section>

        <Section>
          <SectionTitle>{t('city')}</SectionTitle>
          <ChipRow>
            {cities.map((ct) => (
              <Chip
                key={ct}
                selected={city === ct}
                onPress={() => setCity(city === ct ? null : ct)}
              >
                <ChipText selected={city === ct}>{ct}</ChipText>
              </Chip>
            ))}
          </ChipRow>
        </Section>

        <View style={{ height: 8 }} />
        <Button
          variant="primary"
          onPress={async () => {
            const saved = await getWithTTL<any>(BOSSES_FILTERS_KEY, Number.MAX_SAFE_INTEGER);
            const normalizedChance =
              chance === 'Low'
                ? 'low'
                : chance === 'Mid'
                ? 'medium'
                : chance === 'High'
                ? 'high'
                : chance === 'No Chance'
                ? 'no chance'
                : chance === 'Lost Track'
                ? 'lost track'
                : null;
            await setWithTTL(BOSSES_FILTERS_KEY, {
              ...(saved ?? {}),
              chance: normalizedChance,
              city: city ?? null,
            });
            navigation.goBack();
          }}
        >
          <ButtonText>{t('apply')}</ButtonText>
        </Button>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}


