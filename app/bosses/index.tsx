// app/bosses/index.tsx
import { Button, ButtonText } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { FlatList, Text, View } from "react-native";
import styled from "styled-components/native";

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

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Bosses" });
  }, [navigation]);

  return (
    <Screen>
      <TopBar>
        <Search placeholder="Search bosses..." placeholderTextColor="#888" />
        <Filter onPress={() => router.push("/settings")}>
          <Text style={{ color: "#fff" }}>⚙︎</Text>
        </Filter>
      </TopBar>

      <SectionTitle>Bosses Killed Yesterday</SectionTitle>
      <Horizontal
        data={MOCK_KILLED}
        keyExtractor={(i: any) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <Card style={{ marginRight: 12, width: 160 }}>
            <BossName>{item.name}</BossName>
            <Chance>{item.chance}</Chance>
          </Card>
        )}
        style={{ marginBottom: 12 }}
      />

      <FlatList
        data={MOCK_LIST}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card
            onTouchEnd={() =>
              router.push({
                pathname: "/bosses/[id]",
                params: { id: item.id, name: item.name },
              })
            }
          >
            <BossName>{item.name}</BossName>
            <Chance>{item.chancePercent}% chance • last checked 1h ago</Chance>
            <View style={{ height: 8 }} />
            <Button variant="primary">
              <ButtonText>Check</ButtonText>
            </Button>
          </Card>
        )}
      />
    </Screen>
  );
}
