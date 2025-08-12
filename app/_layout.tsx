// app/_layout.tsx
import BossStatusModal from '@/components/ui/BossStatusModal';
import LeftDrawer from '@/components/ui/LeftDrawer';
import TimelinePanel from '@/components/ui/TimelinePanel';
import { AuthProvider } from '@/state/auth';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { darkTheme, lightTheme } from '@/theme/theme';
import {
  CinzelDecorative_400Regular,
  CinzelDecorative_700Bold,
} from '@expo-google-fonts/cinzel-decorative';
import { useFonts } from 'expo-font';

const HeaderTitle = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h2,
}));

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [loaded] = useFonts({
    CinzelRegular: CinzelDecorative_400Regular,
    CinzelBold: CinzelDecorative_700Bold,
  });
  if (!loaded) return null;

  return (
    <NavigationThemeProvider value={theme}>
      <StyledThemeProvider theme={theme}>
        <SafeAreaProvider>
          <AuthProvider>
            <Stack
            screenOptions={{
              headerShown: true,
              headerTransparent: true,
              headerShadowVisible: false,
              headerTitleAlign: 'center',
              headerTintColor: theme.tokens.colors.text,
              headerBackButtonDisplayMode: 'minimal',
              headerStyle: { backgroundColor: 'transparent' },
              headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            </Stack>
            <BossStatusModal/>
            <TimelinePanel />
            <LeftDrawer />
          </AuthProvider>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaProvider>
      </StyledThemeProvider>
    </NavigationThemeProvider>
  );
}