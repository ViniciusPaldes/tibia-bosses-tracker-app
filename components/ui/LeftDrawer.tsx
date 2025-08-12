import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useAuth } from '@/state/auth';
import { useModals } from '@/state/modals';

const Overlay = styled(Pressable)(() => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
}));

const Drawer = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: Math.round(Dimensions.get('window').width * 0.82),
  backgroundColor: theme.tokens.colors.card,
  borderTopRightRadius: theme.tokens.radius,
  borderBottomRightRadius: theme.tokens.radius,
}));

const Area = styled(SafeAreaView)(({ theme }) => ({
  flex: 1,
  padding: theme.tokens.spacing(2),
}));

const Avatar = styled.View(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: theme.tokens.colors.backgroundDark,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

const AvatarImage = styled.Image(() => ({ width: '100%', height: '100%' }));
const AvatarInitial = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: 28,
}));

const Name = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h3,
  marginTop: theme.tokens.spacing(1),
  textAlign: 'center',
}));

const Menu = styled.View(() => ({ flex: 1, marginTop: 16 }));

const Item = styled.Pressable(({ theme }) => ({
  paddingVertical: 12,
}));

const ItemText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontSize: theme.tokens.typography.sizes.body,
}));

const Footer = styled.View(() => ({ alignItems: 'flex-start', paddingTop: 8 }));
const Version = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.textSecondary,
  fontSize: theme.tokens.typography.sizes.caption,
}));

export default function LeftDrawer() {
  const { modals, close } = useModals();
  const { user, signOut } = useAuth();
  const visible = !!modals.drawer;
  const tx = useRef(new Animated.Value(-Dimensions.get('window').width)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(tx, { toValue: 0, duration: 250, useNativeDriver: true, easing: undefined }).start();
    } else {
      Animated.timing(tx, { toValue: -Dimensions.get('window').width, duration: 200, useNativeDriver: true, easing: undefined }).start();
    }
  }, [visible, tx]);

  if (!visible) return null;

  const initials = (user?.displayName?.trim()?.[0] ?? '?').toUpperCase();
  const version = Constants.expoConfig?.version ?? '';

  return (
    <View style={{ position: 'absolute', inset: 0 }}>
      <Overlay onPress={() => close('drawer')} />
      <Drawer style={{ transform: [{ translateX: tx }] }} onStartShouldSetResponder={() => true}>
        <Area edges={['top', 'left', 'bottom']}>
          <View style={{ alignItems: 'center' }}>
            <Avatar>
              {user?.photoURL ? (
                <AvatarImage source={{ uri: user.photoURL }} resizeMode="cover" />
              ) : (
                <AvatarInitial>{initials}</AvatarInitial>
              )}
            </Avatar>
            <Name numberOfLines={1}>{user?.displayName ?? 'Adventurer'}</Name>
          </View>

          <Menu>
            <Item onPress={() => { close('drawer'); router.push('/settings'); }}>
              <ItemText>Settings</ItemText>
            </Item>
            <Item onPress={async () => { close('drawer'); await signOut(); router.replace('/onboarding'); }}>
              <ItemText>Logout</ItemText>
            </Item>
          </Menu>

          <Footer>
            <Version>v{version}</Version>
          </Footer>
        </Area>
      </Drawer>
    </View>
  );
}


