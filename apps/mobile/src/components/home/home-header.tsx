import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type HomeHeaderProps = {
  onPressSearch?: () => void;
  onPressHelp?: () => void;
  onPressLogo?: () => void;
};

export const HomeHeader = ({
  onPressSearch,
  onPressHelp,
  onPressLogo,
}: HomeHeaderProps) => {
  const handleSearchPress = () => {
    onPressSearch?.();
  };

  const handleHelpPress = () => {
    onPressHelp?.();
  };

  const handleLogoPress = () => {
    onPressLogo?.();
  };

  return (
    <View className="flex-row items-center gap-3 px-4 pb-3 pt-1">
      <Pressable
        onPress={handleLogoPress}
        accessibilityRole="button"
        accessibilityLabel="Spinova, menu"
        className="h-12 w-12 items-center justify-center rounded-2xl bg-primary active:opacity-90"
      >
        <View className="h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <Ionicons name="globe-outline" size={22} color="#FFFFFF" />
        </View>
      </Pressable>

      <Pressable
        onPress={handleSearchPress}
        accessibilityRole="button"
        accessibilityLabel="Buscar"
        className="h-12 flex-1 flex-row items-center justify-end rounded-2xl bg-[#2C2C2E] px-4 active:opacity-90"
      >
        <Ionicons name="search" size={22} color="#FFFFFF" />
      </Pressable>

      <Pressable
        onPress={handleHelpPress}
        accessibilityRole="button"
        accessibilityLabel="Ajuda"
        className="h-12 w-12 items-center justify-center rounded-2xl bg-[#2C2C2E] active:opacity-90"
      >
        <View className="h-8 w-8 items-center justify-center rounded-full bg-white/10">
          <Ionicons name="help" size={20} color="#D4D4D4" />
        </View>
      </Pressable>
    </View>
  );
};
