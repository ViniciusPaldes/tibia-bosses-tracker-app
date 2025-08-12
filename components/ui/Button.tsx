import { Platform } from "react-native";
import styled from "styled-components/native";

type Variant = "primary" | "secondary" | "destructive";

export const Button = styled.TouchableOpacity<{ variant?: Variant }>(
  ({ theme, variant = "primary" }) => {
    const bg =
      variant === "secondary"
        ? theme.tokens.colors.secondary
        : variant === "destructive"
        ? theme.tokens.colors.danger
        : theme.tokens.colors.primary;

    return {
      paddingVertical: theme.tokens.spacing(1.5),
      paddingHorizontal: theme.tokens.spacing(2),
      borderRadius: theme.tokens.radius,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: bg,
      shadowColor: bg,
      shadowOpacity: 0.4,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    };
  }
);

export const ButtonText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.button,
  fontSize: theme.tokens.typography.sizes.body,
  // Avoid Android font fallback when using custom fonts
  fontWeight: Platform.OS === "ios" ? "700" : undefined,
  textAlign: "center",
}));
