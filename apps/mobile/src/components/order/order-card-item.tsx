import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import type { OrderItem } from "@/services/orders";
import { formatCurrency, formatProductFormat } from "@/utils";

type OrderCardItemProps = {
  item: OrderItem;
  onProductPress: (productId: string) => void;
};

export function OrderCardItem({ item, onProductPress }: OrderCardItemProps) {
  return (
    <Pressable
      onPress={() => onProductPress(item.productId)}
      accessibilityRole="button"
      accessibilityLabel={`Ver produto ${item.product.title}`}
      className="flex-row items-center gap-3 py-2.5 active:opacity-80"
    >
      <View className="h-14 w-14 overflow-hidden rounded-xl bg-[#242126]">
        {item.product.image ? (
          <Image
            source={item.product.image.url}
            accessibilityLabel={
              item.product.image.altText ?? item.product.title
            }
            contentFit="cover"
            style={{ width: "100%", height: "100%" }}
            transition={150}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="disc-outline" size={24} color="#777179" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="font-sans text-sm font-semibold text-white"
        >
          {item.product.title}
        </Text>
        <Text numberOfLines={1} className="font-golos text-xs text-white/60">
          {item.product.artist.name}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <View className="rounded bg-white/10 px-1.5 py-0.5">
            <Text className="font-golos text-[10px] text-white/80">
              {formatProductFormat(item.product.format)}
            </Text>
          </View>
          <Text className="font-golos text-xs text-white/50">
            Qtd: {item.quantity}
          </Text>
        </View>
      </View>

      <Text className="font-golos-semibold text-sm text-white">
        {formatCurrency(item.unitPrice)}
      </Text>
    </Pressable>
  );
}
