import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

type ProductListHeaderProps = {
  title: string;
  totalItems?: number;
};

export const ProductListHeader = ({
  title,
  totalItems,
}: ProductListHeaderProps) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center gap-3 px-4 pb-4 pt-2">
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        hitSlop={8}
        className="h-10 w-10 items-center justify-center rounded-2xl bg-[#2C2C2E] active:opacity-80"
      >
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </Pressable>

      <View className="flex-1">
        <Text className="font-sans text-xl text-white" numberOfLines={1}>
          {title}
        </Text>
        {totalItems !== undefined ? (
          <Text className="font-golos text-xs text-white/50">
            {totalItems} {totalItems === 1 ? "produto" : "produtos"}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
