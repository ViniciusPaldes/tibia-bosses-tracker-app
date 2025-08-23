import 'react-native-gesture-handler';

import { AuthProvider, useAuth } from '@/store/auth';

import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

import { initI18n } from '@/i18n';
import { Sentry } from '@/services/api/sentry';
import { darkTheme, lightTheme } from '@/theme';
import {
  CinzelDecorative_400Regular,
  CinzelDecorative_700Bold,
} from '@expo-google-fonts/cinzel-decorative';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';

export default Sentry.wrap(function Root() {
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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <AuthProvider>
              <RootNavigator />
              {/* Global UI overlays */}
              {/* <Toast config={toastConfig} />
              <BossStatusModal />
              <TimelinePanel />
              <LeftDrawer />
              <DebugBadge /> */}
            </AuthProvider>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </StyledThemeProvider>
    </NavigationThemeProvider>
  );
});

function RootNavigator() {
  const { user } = useAuth();
  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
