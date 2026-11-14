import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/lib/theme";
import type { OrderItem } from "@/services/orders";
import { formatCurrency, formatProductFormat } from "@/utils";

type OrderCardItemProps = {
  item: OrderItem;
  onProductPress?: (productId: string) => void;
  variant?: "card" | "detail";
};

export function OrderCardItem({
  item,
  onProductPress,
  variant = "card",
}: OrderCardItemProps) {
  const isDetail = variant === "detail";
  const priceValue = isDetail
    ? Number(item.unitPrice) * item.quantity
    : item.unitPrice;

  return (
    <Pressable
      onPress={
        onProductPress ? () => onProductPress(item.productId) : undefined
      }
      disabled={!onProductPress}
      accessibilityRole={onProductPress ? "button" : undefined}
      accessibilityLabel={
        onProductPress ? `Ver produto ${item.product.title}` : undefined
      }
      className={`flex-row items-center gap-3 ${
        isDetail ? "border-b border-white/10 py-4" : "py-2.5"
      } ${onProductPress ? "active:opacity-80" : ""}`}
    >
      <View
        className={`${
          isDetail ? "h-16 w-16" : "h-14 w-14"
        } overflow-hidden rounded-xl bg-[#242126]`}
      >
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
            <Ionicons
              name="disc-outline"
              size={isDetail ? 26 : 24}
              color={colors.muted.foreground}
            />
          </View>
        )}
      </View>

      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={isDetail ? 2 : 1}
          className={`font-sans font-semibold text-white ${
            isDetail ? "text-base" : "text-sm"
          }`}
        >
          {item.product.title}
        </Text>
        <Text
          numberOfLines={1}
          className={`font-golos ${
            isDetail ? "mt-0.5 text-sm text-white/70" : "text-xs text-white/60"
          }`}
        >
          {item.product.artist.name}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <View className="rounded bg-white/10 px-1.5 py-0.5">
            <Text className="font-golos text-[10px] text-white/80">
              {formatProductFormat(item.product.format)}
            </Text>
          </View>
          <Text
            className={`font-golos text-xs ${
              isDetail ? "text-white/60" : "text-white/50"
            }`}
          >
            Qtd: {item.quantity}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text className="font-golos-semibold text-sm text-white">
          {formatCurrency(priceValue)}
        </Text>
        {isDetail && item.quantity > 1 ? (
          <Text className="mt-0.5 font-golos text-xs text-white/50">
            {formatCurrency(item.unitPrice)} cada
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
