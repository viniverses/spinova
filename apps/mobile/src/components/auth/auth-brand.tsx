import { Image } from "expo-image";
import { View } from "react-native";

export const AuthBrand = () => (
  <View className="mb-6 items-center">
    <View
      className="items-center gap-3"
      accessible
      accessibilityRole="image"
      accessibilityLabel="Spinova"
    >
      <View
        className="h-16 w-16 items-center justify-center overflow-hidden rounded-[13px] bg-primary"
        style={{
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.14,
          shadowRadius: 16,
          elevation: 5,
        }}
      >
        <Image
          source={require("../../../assets/rounded-logo.svg")}
          contentFit="contain"
          contentPosition="center"
          style={{ width: "100%", height: "100%" }}
          accessible={false}
        />
      </View>
    </View>
  </View>
);
