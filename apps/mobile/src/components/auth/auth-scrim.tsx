import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, withAlpha } from "@/lib/theme";

export const AuthScrim = () => (
  <>
    <View className="absolute inset-0 bg-black/50" />
    <LinearGradient
      colors={[
        "transparent",
        withAlpha(colors.surface.base, 0.8),
        colors.surface.base,
      ]}
      locations={[0, 0.55, 0.85]}
      className="absolute inset-0"
    />
  </>
);
