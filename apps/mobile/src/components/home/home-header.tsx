import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type HomeHeaderProps = {
  onPressSearch?: () => void;
  onPressHelp?: () => void;
  onPressLogo?: () => void;
  leadingVariant?: "brand" | "back";
};

export const HomeHeader = ({
  onPressSearch,
  onPressHelp,
  onPressLogo,
  leadingVariant = "brand",
}: HomeHeaderProps) => {
  const isBackHeader = leadingVariant === "back";

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
    <View
      className={`flex-row items-center ${
        isBackHeader ? "gap-2 px-5 pb-3 pt-3" : "gap-3 px-4 pb-3 pt-1"
      }`}
    >
      <Pressable
        onPress={handleLogoPress}
        accessibilityRole="button"
        accessibilityLabel={
          leadingVariant === "back" ? "Voltar" : "Spinova, menu"
        }
        className={`items-center justify-center rounded-xl active:opacity-90 ${
          isBackHeader
            ? "h-[52px] w-[52px] bg-[#2C2C2E]"
            : "h-12 w-12 bg-primary"
        }`}
      >
        {isBackHeader ? (
          <Ionicons name="chevron-back" size={22} color="#D4D4D4" />
        ) : (
          <View className="h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Ionicons name="globe-outline" size={22} color="#FFFFFF" />
          </View>
        )}
      </Pressable>

      <Pressable
        onPress={handleSearchPress}
        accessibilityRole="button"
        accessibilityLabel="Buscar"
        className={`flex-1 flex-row items-center justify-end bg-[#2C2C2E] px-4 active:opacity-90 ${
          isBackHeader ? "h-[52px] rounded-xl" : "h-12 rounded-2xl"
        }`}
      >
        <Ionicons
          name="search"
          size={isBackHeader ? 24 : 22}
          color={isBackHeader ? "#C7C7CC" : "#FFFFFF"}
        />
      </Pressable>

      <Pressable
        onPress={handleHelpPress}
        accessibilityRole="button"
        accessibilityLabel="Ajuda"
        className={`items-center justify-center bg-[#2C2C2E] active:opacity-90 ${
          isBackHeader
            ? "h-[52px] w-[52px] rounded-xl"
            : "h-12 w-12 rounded-2xl"
        }`}
      >
        <View
          className={`items-center justify-center rounded-full ${
            isBackHeader ? "h-6 w-6 bg-[#D4D4D4]" : "h-8 w-8 bg-white/10"
          }`}
        >
          <Ionicons
            name="help"
            size={isBackHeader ? 16 : 20}
            color={isBackHeader ? "#2C2C2E" : "#D4D4D4"}
          />
        </View>
      </Pressable>
    </View>
  );
};
