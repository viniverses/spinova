import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

type CheckoutDetailProps = {
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  actionIcon?: ComponentProps<typeof Ionicons>["name"];
  lines: string[];
  onEdit: () => void;
};

export function CheckoutDetail({
  title,
  icon,
  actionIcon = "create-outline",
  lines,
  onEdit,
}: CheckoutDetailProps) {
  return (
    <View className="flex-row items-center">
      <View className="h-[104px] w-[104px] shrink-0 items-center justify-center rounded-xl bg-[#272628]">
        <Ionicons name={icon} size={52} color="#F7F6F7" />
      </View>

      <View className="ml-3.5 min-w-0 flex-1 self-stretch justify-center">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.76}
          className="font-sans text-[22px] leading-7 text-[#F7F6F7]"
        >
          {title}
        </Text>
        <View className="mt-1">
          {lines.map((line) => (
            <Text
              key={line}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
              className="font-golos text-[15px] leading-5 text-[#EFEDEF]"
            >
              {line}
            </Text>
          ))}
        </View>
      </View>

      <Pressable
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel={`Editar ${title.toLowerCase()}`}
        hitSlop={8}
        className="h-12 w-12 shrink-0 items-center justify-center rounded-full active:bg-white/10"
      >
        <Ionicons name={actionIcon} size={25} color="#F7F6F7" />
      </Pressable>
    </View>
  );
}
