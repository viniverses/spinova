import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const AuthScrim = () => (
  <>
    <View className="absolute inset-0 bg-black/50" />
    <LinearGradient
      colors={["transparent", "rgba(23, 21, 24, 0.8)", "#171518"]}
      locations={[0, 0.55, 0.85]}
      className="absolute inset-0"
    />
  </>
);
