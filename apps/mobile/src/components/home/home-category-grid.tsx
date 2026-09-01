import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { HOME_CATEGORIES } from "../../../data/home-content";

type HomeCategoryGridProps = {
  onPressCategory?: (id: string) => void;
};

const H_PADDING = 16;
const GAP = 12;

export const HomeCategoryGrid = ({
  onPressCategory,
}: HomeCategoryGridProps) => {
  const { width } = useWindowDimensions();
  const itemWidth = (width - H_PADDING * 2 - GAP * 2) / 3;

  const handlePress = (id: string) => {
    onPressCategory?.(id);
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
              className={`items-center justify-center rounded-2xl active:opacity-90 ${
                isPrimary ? "bg-primary" : "bg-[#E8E8E8]"
              }`}
            >
              <Ionicons
                name={item.icon}
                size={26}
                color={isPrimary ? "#FFFFFF" : "#111111"}
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
