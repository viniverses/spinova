import { colors } from "@/lib/theme";
import { ActivityIndicator, View } from "react-native";

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
    </View>
  );
}
