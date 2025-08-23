// theme/tokens.ts
export const colors = {
  primary: "#A67C52",
  secondary: "#6B4F3F",
  backgroundDark: "#0D0D0D",
  card: "#1A1A1A",
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  accentGold: "#FFD700",
  accentPurple: "#A259FF",
  success: "#4CAF50",
  warning: "#FF9800",
  danger: "#F44336",
};

export const typography = {
  fonts: {
    title: "CinzelBold",
    body: "CinzelRegular",
    button: "CinzelBold",
  },
  sizes: { h1: 28, h2: 22, h3: 18, body: 16, caption: 14 },
  lineHeights: { h1: 34, h2: 28, h3: 24, body: 22, caption: 20 },
};

export const spacing = (n: number) => 8 * n; // base-8 scale
export const radius = 12;

export type Tokens = {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: number;
};
