// app/bosses/[id].tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
const Title = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h2,
  marginBottom: 12,
}));

const Section = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 12,
  marginBottom: 12,
}));

export default function BossDetail() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: name ?? "Boss Detail" });
  }, [name, navigation]);

  return (
    <Screen>

      <Section>
        <Text style={{ color: "#fff" }}>Location: Edron, Dragon Lair</Text>
      </Section>

      <Section>
        <Text style={{ color: "#fff", marginBottom: 6 }}>Last Sightings</Text>
        <Text style={{ color: "#b0b0b0" }}>2025-08-08 10:21 — Vinicius</Text>
      </Section>

      <Section>
        <Text style={{ color: "#fff", marginBottom: 6 }}>Loot</Text>
        <Text style={{ color: "#b0b0b0" }}>
          Dragon Scale • Gold • Boots of Haste
        </Text>
      </Section>

      <Button
        variant="primary"
        onPress={() => router.push("/(modals)/boss-status")}
      >
        <ButtonText>Mark as Watched</ButtonText>
      </Button>
    </Screen>
  );
}
