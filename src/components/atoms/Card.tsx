import styled from "styled-components/native";

export const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: theme.tokens.spacing(1.5),
  marginVertical: theme.tokens.spacing(1),
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.06)",
}));
