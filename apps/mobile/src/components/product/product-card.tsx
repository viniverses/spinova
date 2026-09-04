import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useIsWishlisted, useToggleWishlist } from "@/hooks/use-wishlist";
import { colors } from "@/lib/theme";
import type { ProductCatalogItem } from "@/services/products";

type ProductCardProduct = Pick<
  ProductCatalogItem,
  "id" | "title" | "artist" | "price" | "inStock" | "image"
>;

type ProductCardProps = {
  product: ProductCardProduct;
  width: number;
  showFavorite?: boolean;
  isWishlistItem?: boolean;
};

const formatPrice = (value: string) =>
  `R$ ${Number(value).toFixed(2).replace(".", ",")}`;

/** Shared card for every product collection in the app. */
export const ProductCard = ({
  product,
  width,
  showFavorite = true,
  isWishlistItem = false,
}: ProductCardProps) => {
  const router = useRouter();
  const isFavorite = useIsWishlisted(product.id).data ?? false;
  const { mutate: toggleWishlist, isPending } = useToggleWishlist();

  const handleToggleFavorite = () => {
    toggleWishlist({
      productId: product.id,
      isFavorited: isWishlistItem || isFavorite,
    });
  };

  const handlePress = () => {
    router.push(`/product/${product.id}` as never);
  };

  const favoriteLabel =
    isWishlistItem || isFavorite
      ? `Remover ${product.title} da lista de desejos`
      : `Adicionar ${product.title} à lista de desejos`;

  return (
    <View className="mb-2" style={{ width }}>
      <View className="relative">
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={`${product.title}, ${product.artist.name}`}
          className="active:opacity-90"
        >
          <View className="aspect-square overflow-hidden rounded-2xl bg-[#242126]">
            {product.image ? (
              <Image
                source={product.image.url}
                accessibilityLabel={product.image.altText ?? product.title}
                contentFit="cover"
                style={{ width: "100%", height: "100%" }}
                transition={180}
              />
            ) : (
              <View className="flex-1 items-center justify-center bg-[#242126]">
                <Ionicons name="disc-outline" size={44} color="#777179" />
              </View>
            )}

            {!product.inStock ? (
              <View className="absolute bottom-2 left-2 rounded-full bg-black/75 px-3 py-1.5">
                <Text className="font-golos-semibold text-xs text-white">
                  Esgotado
                </Text>
              </View>
            ) : null}
          </View>

          <View className="min-h-28 pt-3">
            <Text
              className="font-sans text-base leading-5 text-white"
              numberOfLines={2}
            >
              {product.title}
            </Text>
            <Text
              className="mt-1 font-golos text-sm text-white/60"
              numberOfLines={1}
            >
              {product.artist.name}
            </Text>

            <View className="mt-1">
              <Text className="font-golos-semibold text-base text-white">
                {formatPrice(product.price)}
              </Text>
            </View>
          </View>
        </Pressable>

        {showFavorite ? (
          <Pressable
            onPress={handleToggleFavorite}
            disabled={isPending}
            accessibilityRole="button"
            accessibilityLabel={favoriteLabel}
            accessibilityState={{ disabled: isPending }}
            hitSlop={6}
            className="absolute right-2 top-2 h-9 w-9 items-center justify-center rounded-full bg-black/60 active:opacity-75 disabled:opacity-50"
          >
            <Ionicons
              name={isWishlistItem || isFavorite ? "heart" : "heart-outline"}
              size={20}
              className="-mt-[1]"
              color={
                isWishlistItem || isFavorite
                  ? colors.primary.DEFAULT
                  : "#FFFFFF"
              }
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};
