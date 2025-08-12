import { Button, ButtonText } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
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

export default function FilterScreen() {
  const navigation = useNavigation();
  const [chance, setChance] = useState<"Low" | "Mid" | "High" | null>(null);
  const [city, setCity] = useState<
    "Venore" | "Carlin" | "Thais" | null
  >(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Filter" });
  }, [navigation]);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Section>
          <SectionTitle>Chance</SectionTitle>
          <ChipRow>
            {["Low", "Mid", "High"].map((c) => (
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
          <SectionTitle>City</SectionTitle>
          <ChipRow>
            {["Venore", "Carlin", "Thais"].map((ct) => (
              <Chip
                key={ct}
                selected={city === (ct as any)}
                onPress={() => setCity(city === (ct as any) ? null : (ct as any))}
              >
                <ChipText selected={city === (ct as any)}>{ct}</ChipText>
              </Chip>
            ))}
          </ChipRow>
        </Section>

        <View style={{ height: 8 }} />
        <Button variant="primary" onPress={() => navigation.goBack()}>
          <ButtonText>Apply</ButtonText>
        </Button>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}


