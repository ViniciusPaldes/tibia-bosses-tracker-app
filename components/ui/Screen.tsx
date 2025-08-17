import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { ReactNode } from "react";
import { Dimensions, ImageSourcePropType, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
const { width, height } = Dimensions.get("window");

interface ScreenProps {
  children: ReactNode;
  padding?: number;
  withHeaderOffset?: boolean; // default: true
  scrollable?: boolean; // default: false
  background?: ImageSourcePropType;
}

const Container = styled(SafeAreaView)<{ padding?: number }>(
  ({ theme, padding }) => ({
    flex: 1,
    backgroundColor: theme.tokens.colors.backgroundDark,
    paddingHorizontal: padding ?? 16,
  })
);


const BgImage = styled(Image)({
  position: "absolute",
  width,
  height,
  top: 0,
  left: 0,
});

const Dim = styled.View({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.45)", // subtle dark overlay for readability
});


export function Screen({
  children,
  padding,
  withHeaderOffset = true,
  scrollable = false,
  background,
}: ScreenProps) {
  const headerHeight = useHeaderHeight(); // respeita iOS/Android
  return (
    <Container
      // usamos apenas bottom no SafeArea; o top vem do headerHeight
      edges={["bottom"]}
      padding={padding}
      style={withHeaderOffset ? { paddingTop: headerHeight + 8 } : undefined}
    >
      {background && (
        <>
          <BgImage source={background} contentFit="cover" transition={250} />
          <Dim />
        </>
      )}
      {scrollable ? (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </Container>
  );
}
