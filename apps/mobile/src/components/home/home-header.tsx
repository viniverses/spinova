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
    <View
      className={`flex-row items-center ${
        isBackHeader ? "gap-2 px-5 pb-3 pt-3" : "gap-3 px-4 pb-3 pt-1"
      }`}
    >
      <Pressable
        onPress={onPressLogo}
        accessibilityRole="button"
        accessibilityLabel={
          isBackHeader ? "Voltar" : "Spinova, menu"
        }
        className={`items-center justify-center rounded-xl overflow-hidden active:opacity-90 ${
          isBackHeader
            ? "h-[52px] w-[52px] bg-[#2C2C2E]"
            : "h-12 w-12 bg-primary"
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
        className={`flex-1 flex-row items-center bg-[#2C2C2E] px-3.5 active:opacity-90 ${
          isBackHeader ? "h-[52px] rounded-xl" : "h-12 rounded-2xl"
        }`}
      >
        <Ionicons
          name="search"
          size={isBackHeader ? 22 : 20}
          color={isBackHeader ? "#C7C7CC" : "#A3A3A3"}
        />
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
