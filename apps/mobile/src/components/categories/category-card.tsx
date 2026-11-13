import { Ionicons } from "@expo/vector-icons";
import { useState, type ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/lib/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PRESS_TIMING = { duration: 150, easing: Easing.out(Easing.quad) };

type CategoryCardProps = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  width: number;
  featured?: boolean;
  animatePress?: boolean;
  onPress: () => void;
};

export function CategoryCard({
  label,
  icon,
  width,
  featured = false,
  animatePress = true,
  onPress,
}: CategoryCardProps) {
  const reduceMotion = useReducedMotion();
  const pressed = useSharedValue(0);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pressStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.16,
    transform: [
      { scale: reduceMotion || !animatePress ? 1 : 1 - pressed.value * 0.04 },
    ],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`Ver ${label}`}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, PRESS_TIMING);
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, PRESS_TIMING);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.card,
        {
          width,
          backgroundColor: featured
            ? colors.primary.DEFAULT
            : hovered
              ? "#FFFFFF"
              : "#F2F2F4",
          borderColor: focused
            ? featured
              ? "#FFFFFF"
              : colors.primary.DEFAULT
            : "transparent",
        },
        pressStyle,
      ]}
    >
      <Ionicons
        name={icon}
        size={24}
        color={featured ? colors.primary.foreground : colors.primary.DEFAULT}
        accessible={false}
      />
      <Text
        className="font-golos-semibold"
        style={[styles.label, featured && { color: colors.primary.foreground }]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 88,
    paddingHorizontal: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 2,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: "#171719",
    flexShrink: 1,
  },
});
