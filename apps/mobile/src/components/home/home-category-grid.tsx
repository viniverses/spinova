import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { HOME_CATEGORIES } from "./constants";

// Categories that map to a /collection/[id] route
const NAVIGABLE_IDS = new Set([
  "bestsellers",
  "new",
  "promo",
  "import",
  "national",
]);

type HomeCategoryGridProps = {
  onPressCategory?: (id: string) => void;
};

const H_PADDING = 16;
const GAP = 12;
const CATEGORY_ICONS = {
  bestsellers: require("../../../assets/svg/best-sellers.svg"),
  new: require("../../../assets/svg/new.svg"),
  promo: require("../../../assets/svg/sales.svg"),
  import: require("../../../assets/svg/imported.svg"),
  national: require("../../../assets/svg/national.svg"),
  more: require("../../../assets/svg/more.png"),
} as const;

export const HomeCategoryGrid = ({
  onPressCategory,
}: HomeCategoryGridProps) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const itemWidth = (width - H_PADDING * 2 - GAP * 2) / 3;

  const handlePress = (id: string) => {
    onPressCategory?.(id);
    if (id === "more") {
      router.push("/lists" as never);
      return;
    }
    if (NAVIGABLE_IDS.has(id)) {
      router.push(`/collection/${id}` as never);
    }
  };

  return (
    <View className="px-4 pb-2 pt-1">
      <View className="flex-row flex-wrap" style={{ gap: GAP }}>
        {HOME_CATEGORIES.map((item) => {
          const isPrimary = item.variant === "primary";
          return (
            <Pressable
              key={item.id}
              onPress={() => handlePress(item.id)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={{ width: itemWidth, height: 72 }}
              className={`items-center justify-center rounded-[10] active:opacity-90 ${
                isPrimary ? "bg-primary" : "bg-[#E8E8E8]"
              }`}
            >
              <Image
                source={CATEGORY_ICONS[item.id as keyof typeof CATEGORY_ICONS]}
                contentFit="contain"
                style={{ width: 26, height: 26 }}
                accessible={false}
              />
              <Text
                className={`mt-1.5 px-1 text-center font-golos text-[11px] leading-tight ${
                  isPrimary ? "text-white" : "text-[#111111]"
                }`}
                numberOfLines={2}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
