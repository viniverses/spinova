import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text } from "react-native";
import { HeaderIconButton } from "@/components/navigation/header-icon-button";
import { NavigationHeader } from "@/components/navigation/navigation-header";

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
    <NavigationHeader
      onPressBack={isBackHeader ? onPressLogo : undefined}
      onPressHelp={onPressHelp}
      leading={
        isBackHeader ? undefined : (
          <HeaderIconButton
            variant="primary"
            onPress={onPressLogo}
            accessibilityLabel="Spinova, menu"
          >
            <Image
              source={require("../../../assets/rounded-logo.svg")}
              contentFit="contain"
              style={{ width: "100%", height: "100%" }}
              accessible={false}
            />
          </HeaderIconButton>
        )
      }
    >
      <Pressable
        onPress={onPressSearch}
        accessibilityRole="button"
        accessibilityLabel="Buscar artista ou álbum"
        className="h-12 flex-1 flex-row items-center rounded-2xl bg-surface-control px-3.5 active:opacity-90"
      >
        <Ionicons name="search" size={20} color="#A3A3A3" />
        <Text
          className="flex-1 px-2.5 font-golos text-sm text-white/40"
          numberOfLines={1}
        >
          Buscar artista ou álbum...
        </Text>
      </Pressable>
    </NavigationHeader>
  );
};
