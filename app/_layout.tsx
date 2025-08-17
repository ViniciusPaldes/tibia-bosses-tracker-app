// app/_layout.tsx
import BossStatusModal from '@/components/ui/BossStatusModal';
import LeftDrawer from '@/components/ui/LeftDrawer';
import TimelinePanel from '@/components/ui/TimelinePanel';
import { AuthProvider, useAuth } from '@/state/auth';

import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { initI18n } from '@/src/i18n';
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

/** Centralized auth navigation */
function AuthGate() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initializing) return;

    const inAuth =
      pathname === '/' ||
      pathname === '/index' ||
      pathname === '/onboarding';

    const inApp =
      pathname?.startsWith('/bosses') ||
      pathname === '/settings' ||
      pathname?.startsWith('/(modals)');

    if (!user && inApp) {
      router.replace('/onboarding');
    } else if (user && inAuth) {
      router.replace('/bosses');
    }
  }, [user, initializing, pathname, router]);

  return null;
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [loaded] = useFonts({
    CinzelRegular: CinzelDecorative_400Regular,
    CinzelBold: CinzelDecorative_700Bold,
  });
  const [i18nReady, setI18nReady] = useState(false as any);
  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);

  if (!loaded || !i18nReady) return null;


  return (
    <NavigationThemeProvider value={theme}>
      <StyledThemeProvider theme={theme}>
        <SafeAreaProvider>
          <AuthProvider>
            {/* Owns all redirects between onboarding and app */}
            <AuthGate />

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
              {/* Auth */}
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />

              {/* App */}
              <Stack.Screen name="bosses/index"/>
              <Stack.Screen name="bosses/[id]" options={{ title: 'Boss Detail' }} />
              <Stack.Screen name="settings" />

              {/* Utilities / bench */}
              <Stack.Screen name="benchmark/bench-storage" options={{ title: 'Benchmark' }} />

            </Stack>

            {/* Global UI overlays */}
            <BossStatusModal />
            <TimelinePanel />
            <LeftDrawer />
          </AuthProvider>

          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaProvider>
      </StyledThemeProvider>
    </NavigationThemeProvider>
  );
}