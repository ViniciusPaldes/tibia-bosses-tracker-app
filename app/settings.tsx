// app/settings.tsx
import styled from "styled-components/native";

const Screen = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.tokens.colors.backgroundDark,
  padding: 16,
}));

const Row = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 16,
  marginBottom: 12,
}));

const Label = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
}));

export default function Settings() {
  return (
    <Screen>
      <Row>
        <Label>Notifications</Label>
      </Row>
      <Row>
        <Label>World: Venebra</Label>
      </Row>
      <Row>
        <Label>Language</Label>
      </Row>
      <Row>
        <Label>About</Label>
      </Row>
    </Screen>
  );
}