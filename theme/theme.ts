// theme/theme.ts
import { DarkTheme, DefaultTheme, Theme as NavTheme } from '@react-navigation/native';
import { colors, radius, spacing, Tokens, typography } from './tokens';

export type AppTheme = NavTheme & { tokens: Tokens };

export const lightTheme: AppTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: '#FFFFFF',
    card: '#F2F2F2',
    text: '#111111',
    border: '#E5E5E5',
    notification: colors.accentPurple,
  },
  tokens: { colors, typography, spacing, radius },
};

export const darkTheme: AppTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.backgroundDark,
    card: colors.card,
    text: colors.text,
    border: '#222222',
    notification: colors.accentGold,
  },
  tokens: { colors, typography, spacing, radius },
};