// components/ui/TimelinePanel.tsx
import { listRecentSightings } from '@/data/repo/bossRepo';
import { timeAgo } from '@/data/time';
import { useModals } from '@/state/modals';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const Overlay = styled(Pressable)(() => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
}));

const Panel = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  width: Math.round(Dimensions.get('window').width * 0.85),
  backgroundColor: theme.tokens.colors.card,
  borderTopLeftRadius: theme.tokens.radius,
  borderBottomLeftRadius: theme.tokens.radius,
  // padding moved into SafeArea to respect insets
}));

const PanelSafeArea = styled(SafeAreaView)(({ theme }) => ({
  flex: 1,
  padding: 16,
}));

const Title = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h3,
  marginBottom: 12,
}));

const Row = styled.View(({ theme }) => ({
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: theme.tokens.colors.backgroundDark,
}));

const Primary = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontSize: theme.tokens.typography.sizes.body,
}));

const Secondary = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.textSecondary,
  fontSize: 14,
  marginTop: 2,
}));

type Item = {
  id: string;
  bossName: string;
  player: string;
  at: Date;
  status: 'watched' | 'killed';
};

export default function TimelinePanel() {
  const { modals, close } = useModals();
  const visible = !!modals.timeline;

  const [items, setItems] = useState<Item[]>([]);
  const tx = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  useEffect(() => {
    if (visible) {
      listRecentSightings(30).then((rows: any[]) => setItems(rows as Item[]));
      Animated.timing(tx, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(tx, { toValue: Dimensions.get('window').width, duration: 180, useNativeDriver: true }).start();
    }
  }, [visible, tx]);

  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', inset: 0 }}>
      <Overlay onPress={() => close('timeline')} />
      <Panel
        style={{ transform: [{ translateX: tx }] }}
        // prevent overlay press from firing when tapping inside the panel
        onStartShouldSetResponder={() => true}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <PanelSafeArea edges={['top', 'right', 'bottom']}>
          <Title>Recent Sightings</Title>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            contentInsetAdjustmentBehavior="automatic"
            renderItem={({ item }) => (
              <Row>
                <Primary>{item.bossName}</Primary>
                <Secondary>
                  {item.player} • {timeAgo(new Date(item.at))}
                </Secondary>
              </Row>
            )}
          />
        </PanelSafeArea>
      </Panel>
    </View>
  );
}