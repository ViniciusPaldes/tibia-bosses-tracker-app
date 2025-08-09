// app/_layout.tsx
import {
    CinzelDecorative_400Regular,
    CinzelDecorative_700Bold,
} from '@expo-google-fonts/cinzel-decorative';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { darkTheme, lightTheme } from '@/theme/theme';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

export default function RootLayout() {
  const scheme = useColorScheme();

  const [loaded] = useFonts({
    CinzelRegular: CinzelDecorative_400Regular,
    CinzelBold: CinzelDecorative_700Bold,
  });
  if (!loaded) return null;

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <NavigationThemeProvider value={theme}>
      <StyledThemeProvider theme={theme}>
        <Stack>
          {/* keep explicit screens if the template had them */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(modals)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </StyledThemeProvider>
    </NavigationThemeProvider>
  );
}