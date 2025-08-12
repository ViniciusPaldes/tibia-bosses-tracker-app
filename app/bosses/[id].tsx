// app/bosses/[id].tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

import { useAuth } from "@/state/auth";
import { useModals } from "@/state/modals";


const Section = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 12,
  marginBottom: 12,
}));

export default function BossDetail() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const navigation = useNavigation();
  const { user, initializing } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({ title: name ?? "Boss Detail" });
  }, [name, navigation]);

  return (
    initializing ? null : !user ? (
      <Redirect href="/onboarding" />
    ) : (
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
        onPress={() =>
          useModals
            .getState()
            .open("bossStatus", { bossId: "orshabaal", bossName: "Orshabaal" })
        }
      >
        <ButtonText>Mark as Watched</ButtonText>
      </Button>
    </Screen>
    )
  );
}
