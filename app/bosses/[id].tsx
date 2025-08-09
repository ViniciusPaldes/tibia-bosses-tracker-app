// app/bosses/[id].tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { router } from "expo-router";
import { Text } from "react-native";
import styled from "styled-components/native";

const Screen = styled.ScrollView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.tokens.colors.backgroundDark,
  padding: 16,
}));

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
  return (
    <Screen>
      <Title>Orshabaal</Title>

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