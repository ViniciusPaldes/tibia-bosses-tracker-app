import { useHeaderHeight } from "@react-navigation/elements";
import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

interface ScreenProps {
  children: ReactNode;
  padding?: number;
  withHeaderOffset?: boolean; // default: true
}

const Container = styled(SafeAreaView)<{ padding?: number }>(
  ({ theme, padding }) => ({
    flex: 1,
    backgroundColor: theme.tokens.colors.backgroundDark,
    paddingHorizontal: padding ?? 16,
  })
);

export function Screen({
  children,
  padding,
  withHeaderOffset = true,
}: ScreenProps) {
  const headerHeight = useHeaderHeight(); // respeita iOS/Android
  return (
    <Container
      // usamos apenas bottom no SafeArea; o top vem do headerHeight
      edges={["bottom"]}
      padding={padding}
      style={withHeaderOffset ? { paddingTop: headerHeight + 8 } : undefined}
    >
      {children}
    </Container>
  );
}
