// theme/theme.ts
import { DarkTheme, DefaultTheme, Theme as NavTheme } from '@react-navigation/native';
import { colors, radius, spacing, Tokens, typography } from './tokens';

export type AppTheme = NavTheme & { tokens: Tokens };

export const lightTheme: AppTheme = {
  ...DefaultTheme,
  dark: false,
  tokens: { colors, typography, spacing, radius },
};

export const darkTheme: AppTheme = {
  ...DarkTheme,
  dark: true,
  tokens: { colors, typography, spacing, radius },
};
