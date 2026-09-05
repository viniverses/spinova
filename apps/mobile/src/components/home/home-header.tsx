import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

  return (
    <View className="flex-row items-center gap-3 px-4 pb-3 pt-1">
      <Pressable
        onPress={onPressLogo}
        accessibilityRole="button"
        accessibilityLabel={isBackHeader ? "Voltar" : "Spinova, menu"}
        className={`h-12 w-12 items-center justify-center rounded-2xl overflow-hidden active:opacity-90 ${
          isBackHeader ? "bg-[#2C2C2E]" : "bg-primary"
        }`}
      >
        {isBackHeader ? (
          <Ionicons name="chevron-back" size={22} color="#D4D4D4" />
        ) : (
          <Image
            source={require("../../../assets/rounded-logo.svg")}
            contentFit="contain"
            style={{ width: "100%", height: "100%" }}
            accessible={false}
          />
        )}
      </Pressable>

      <Pressable
        onPress={onPressSearch}
        accessibilityRole="button"
        accessibilityLabel="Buscar artista ou álbum"
        className="h-12 flex-1 flex-row items-center rounded-2xl bg-[#2C2C2E] px-3.5 active:opacity-90"
      >
        <Ionicons name="search" size={20} color="#A3A3A3" />
        <Text
          className="flex-1 px-2.5 font-golos text-sm text-white/40"
          numberOfLines={1}
        >
          Buscar artista ou álbum...
        </Text>
      </Pressable>

      <Pressable
        onPress={onPressHelp}
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
