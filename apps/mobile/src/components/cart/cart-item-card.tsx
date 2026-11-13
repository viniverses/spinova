import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import type { CartItem } from "@/services/cart";
import { formatCurrency } from "@/utils";

import { QuantityControl } from "./quantity-control";

type CartItemCardProps = {
  item: CartItem;
  compact: boolean;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
  onPress: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function CartItemCard({
  item,
  compact,
  decreaseDisabled,
  increaseDisabled,
  onPress,
  onDecrease,
  onIncrease,
}: CartItemCardProps) {
  const coverSize = compact ? 86 : 102;

  return (
    <View
      className="relative rounded-xl bg-[#272627]"
      style={{ minHeight: coverSize + 32 }}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${item.product.title}, de ${item.product.artist.name}`}
        className="flex-row rounded-xl px-2.5 py-4 active:opacity-85"
      >
        {item.product.image?.url ? (
          <Image
            source={{ uri: item.product.image.url }}
            contentFit="cover"
            transition={160}
            style={{
              width: coverSize,
              height: coverSize,
              borderRadius: 12,
            }}
            accessibilityLabel={
              item.product.image.altText ??
              `Capa do álbum ${item.product.title}`
            }
          />
        ) : (
          <View
            className="items-center justify-center rounded-xl bg-[#363438]"
            style={{ width: coverSize, height: coverSize }}
            accessibilityLabel={`Capa indisponível para ${item.product.title}`}
          >
            <Ionicons name="disc-outline" size={36} color="#8F8991" />
          </View>
        )}

        <View className="ml-3 min-w-0 flex-1 justify-between py-0.5 pr-20">
          <View>
            <Text
              numberOfLines={1}
              className="font-sans text-[20px] leading-6 text-[#F8F7F8]"
            >
              {item.product.title}
            </Text>
            <Text
              numberOfLines={1}
              className="mt-1 font-golos text-[15px] leading-5 text-[#ECEAEC]"
            >
              {item.product.artist.name}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            className="font-golos-semibold text-[17px] text-[#F8F7F8]"
          >
            {formatCurrency(Number(item.product.price))}
          </Text>
        </View>
      </Pressable>

      <View className="absolute bottom-4 right-2.5">
        <QuantityControl
          title={item.product.title}
          quantity={item.quantity}
          decreaseDisabled={decreaseDisabled}
          increaseDisabled={increaseDisabled}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </View>
    </View>
  );
}
