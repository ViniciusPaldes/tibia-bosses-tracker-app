// components/ui/LootRow.tsx
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import styled from "styled-components/native";

import { getLootImageUrl } from "@/utils/images";

export type LootRowProps = {
  items: string[];
  onSelect?: (name: string | null) => void;
};

export function toggleSelection(current: string | null, next: string): string | null {
  return current === next ? null : next;
}

const RowContainer = styled.View(({ theme }) => ({
  width: "100%",
  alignItems: "center",
}));

const Content = styled.View(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
}));

const TileContainer = styled(Animated.View)(({ theme }) => ({
  width: 72,
  height: 72,
  borderRadius: theme.tokens.radius,
  backgroundColor: theme.tokens.colors.card,
  marginHorizontal: theme.tokens.spacing(0.5),
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.06)",
  shadowColor: "#000",
  shadowOpacity: 0.35,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
  overflow: "hidden",
}));

const LootImage = styled(Image)(({ theme }) => ({
  width: 56,
  height: 56,
}));

const Tooltip = styled(Animated.View)(({ theme }) => ({
  position: "absolute",
  bottom: 80,
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 999,
  backgroundColor: "rgba(0,0,0,0.8)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
}));

const TooltipText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontSize: 12,
}));

type TileProps = {
  name: string;
  selected: boolean;
  onToggle: (name: string) => void;
};

const LootTile = memo(function LootTile({ name, selected, onToggle }: TileProps) {
  const scale = useSharedValue(1);
  const tooltipOpacity = useSharedValue(0);
  const tooltipScale = useSharedValue(0.95);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borderAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(selected ? "rgba(255,215,0,0.45)" : "rgba(255,255,255,0.06)", { duration: 120 }),
  }));

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
    transform: [{ scale: tooltipScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 14, stiffness: 180 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 180 });
  };

  const handlePress = async () => {
    onToggle(name);
    Haptics.selectionAsync();
  };

  const handleLongPress = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    tooltipOpacity.value = withTiming(1, { duration: 150 });
    tooltipScale.value = withTiming(1, { duration: 150 });
    timeoutRef.current = setTimeout(() => {
      tooltipOpacity.value = withTiming(0, { duration: 180 });
      tooltipScale.value = withTiming(0.95, { duration: 180 });
    }, 1500);
  };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessibilityRole="imagebutton"
      accessibilityLabel={name}
    >
      <TileContainer style={[animatedStyle, borderAnimatedStyle]}>
        <LootImage
          source={{ uri: getLootImageUrl(name) }}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        <Tooltip style={tooltipStyle} pointerEvents="none">
          <TooltipText>{name}</TooltipText>
        </Tooltip>
      </TileContainer>
    </Pressable>
  );
});

export const LootRow: React.FC<LootRowProps> = ({ items, onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  // Preload images for smoother experience
  useEffect(() => {
    items.forEach((name) => {
      const url = getLootImageUrl(name);
      Image.prefetch?.(url);
    });
  }, [items]);

  const onToggle = useCallback(
    (name: string) => {
      setSelected((current) => {
        const next = toggleSelection(current, name);
        onSelect?.(next);
        return next;
      });
    },
    [onSelect]
  );

  const keyExtractor = useCallback((n: string) => n, []);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <LootTile name={item} selected={selected === item} onToggle={onToggle} />
    ),
    [onToggle, selected]
  );

  const data = useMemo(() => items ?? [], [items]);

  return (
    <RowContainer>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, alignItems: "center" }}
      />
    </RowContainer>
  );
};

export default memo(LootRow);


