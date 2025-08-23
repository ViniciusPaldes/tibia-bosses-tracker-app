// import { LeftDrawer, TimelinePanel } from '@/components';
// import { BossStatusModal } from '@/components/organisms/BossStatusModal';
import { Stack } from 'expo-router';
import styled from 'styled-components/native';
// import { Toast } from 'react-native-toast-message/lib/src/Toast';

const HeaderTitle = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h2,
}));

export default function AppLayout() {
  // Renders the navigation stack for all authenticated app routes
  return <Stack
    screenOptions={{
      headerShown: true,
      headerTransparent: true,
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerTintColor: '#FFF',
      headerBackButtonDisplayMode: 'minimal',
      headerStyle: { backgroundColor: 'transparent' },
      headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
      contentStyle: { backgroundColor: 'transparent' },
    }}
  >
    <Stack.Screen name="bosses/index" />
    <Stack.Screen name="bosses/[id]" />
    <Stack.Screen name="settings" />
    <Stack.Screen name="filter" />

    {/* Utilities / bench */}
    <Stack.Screen name="benchmark/bench-storage" />
  </Stack>

  {/* Global UI overlays */ }
  {/* <Toast config={toastConfig}/>
<BossStatusModal />
<TimelinePanel />
<LeftDrawer />
<DebugBadge /> */}
}