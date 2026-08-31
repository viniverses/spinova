import { type ReactNode } from "react";
import { Platform, View, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

/** Figma: Background blur uniform, valor 20 */
const GLASS_BLUR_INTENSITY = 20;

/** Figma: Drop shadow X 7, Y 10, blur 10, spread 0, #000 @ 5% */
const GLASS_BORDER_RADIUS = 24;
const glassDropShadowStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: "#000000",
    shadowOffset: { width: 7, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  android: {
    elevation: 8,
    shadowColor: "#000000",
  },
  default: {
    shadowColor: "#000000",
    shadowOffset: { width: 7, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
});

type AuthGlassCardProps = {
  children: ReactNode;
};

export const AuthGlassCard = ({ children }: AuthGlassCardProps) => (
  <View
    style={[
      {
        width: "100%",
        maxWidth: 440,
        alignSelf: "stretch",
        borderRadius: GLASS_BORDER_RADIUS,
        ...glassDropShadowStyle,
      },
    ]}
  >
    <BlurView
      intensity={GLASS_BLUR_INTENSITY}
      tint="dark"
      experimentalBlurMethod={
        Platform.OS === "android" ? "dimezisBlurView" : undefined
      }
      style={{
        borderRadius: GLASS_BORDER_RADIUS,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
          borderRadius: GLASS_BORDER_RADIUS,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 16,
        }}
      >
        {children}
      </View>
    </BlurView>
  </View>
);
