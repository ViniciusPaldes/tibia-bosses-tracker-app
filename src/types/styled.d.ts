// types/styled.d.ts
import type { AppTheme } from '@/theme';
import 'styled-components/native';

declare module 'styled-components/native' {
  // Isso tipa o `({ theme })` nos styled callbacks
  export interface DefaultTheme extends AppTheme {}
}