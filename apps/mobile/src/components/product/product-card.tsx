import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import type { ProductListItem } from "@/services/products";
import { colors } from "@/lib/theme";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/use-wishlist";

export type ProductCardVariant =
  "wishlist" | "homeRelease" | "homeRecommendation";

type VariantConfig = {
  overlayGradientHeight: string;
  favoriteButtonSize: number;
  favoriteButtonBg: string;
  favoriteButtonClassName: string;
  titleClassName: string;
  showArtist: boolean;
};

const variantConfig: Record<ProductCardVariant, VariantConfig> = {
  homeRelease: {
    overlayGradientHeight: "48%",
    favoriteButtonSize: 20,
    favoriteButtonBg: "bg-white/25",
    favoriteButtonClassName: "h-9 w-9 right-2 top-2",
    titleClassName: "font-sans text-base",
    showArtist: true,
  },
  wishlist: {
    overlayGradientHeight: "48%",
    favoriteButtonSize: 20,
    favoriteButtonBg: "bg-white/25",
    favoriteButtonClassName: "h-9 w-9 right-2 top-2",
    titleClassName: "font-sans text-base",
    showArtist: true,
  },
  homeRecommendation: {
    overlayGradientHeight: "52%",
    favoriteButtonSize: 18,
    favoriteButtonBg: "bg-black/35",
    favoriteButtonClassName: "h-8 w-8 right-2 top-2",
    titleClassName: "font-golos text-xs",
    showArtist: false,
  },
};

type ProductCardProps = {
  product: ProductListItem;
  width: number;
  height: number;
  variant?: ProductCardVariant;
  showFavorite?: boolean;
  showCart?: boolean;
  onAddToCart?: (productId: string) => void;
};

export const ProductCard = ({
  product,
  width,
  height,
  variant = "homeRelease",
  showFavorite = false,
  showCart = false,
  onAddToCart,
}: ProductCardProps) => {
  const router = useRouter();
  const config = variantConfig[variant];
  const isFavorite = useIsWishlisted(product.id).data ?? false;
  const { mutate: toggleWishlist } = useToggleWishlist();

  const handleToggleFavorite = () => {
    toggleWishlist({ productId: product.id, isFavorited: isFavorite });
  };

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${product.artist.name}`}
      onPress={handlePress}
      style={{ width, height }}
      className="overflow-hidden rounded-2xl active:opacity-95"
    >
      <View style={{ width, height }}>
        {product.image ? (
          <Image
            source={product.image.url}
            accessibilityLabel={product.image.altText ?? product.title}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-[#262329]">
            <Ionicons name="disc-outline" size={40} color="#777179" />
          </View>
        )}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -5,
            height: config.overlayGradientHeight,
          }}
        />

        {showFavorite ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite
                ? `Desfavoritar ${product.title}`
                : `Favoritar ${product.title}`
            }
            hitSlop={8}
            className={`absolute items-center justify-center rounded-full ${config.favoriteButtonBg} ${config.favoriteButtonClassName} active:opacity-80`}
          >
            {isFavorite ? (
              <Ionicons
                name="heart"
                size={config.favoriteButtonSize}
                color={colors.primary.DEFAULT}
              />
            ) : (
              <Ionicons
                name="heart-outline"
                size={config.favoriteButtonSize}
                color="#FFFFFF"
              />
            )}
          </Pressable>
        ) : null}

        {showCart ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart?.(product.id);
            }}
            accessibilityRole="button"
            accessibilityLabel="Adicionar ao carrinho"
            hitSlop={8}
            className="absolute bottom-2 right-2 h-9 w-9 items-center justify-center rounded-full bg-white/10 active:opacity-90"
          >
            <Ionicons name="cart" size={20} color="#FFFFFF" />
          </Pressable>
        ) : null}

        <View className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-2">
          <Text
            className={`${config.titleClassName} text-white`}
            numberOfLines={1}
          >
            {product.title}
          </Text>
          {config.showArtist ? (
            <Text
              className="mt-0.5 font-golos text-sm text-white/80"
              numberOfLines={1}
            >
              {product.artist.name}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};
