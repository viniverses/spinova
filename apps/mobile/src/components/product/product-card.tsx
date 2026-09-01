import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import type { Product } from "../../data/products-content";

export type ProductCardVariant =
  | "wishlist"
  | "homeRelease"
  | "homeRecommendation";

type ProductCardProps = {
  product: Product;
  width: number;
  height: number;
  variant?: ProductCardVariant;
  isFavorite?: boolean;
  showFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  showCart?: boolean;
  onAddToCart?: (productId: string) => void;
};

export const ProductCard = ({
  product,
  width,
  height,
  variant = "homeRelease",
  isFavorite = false,
  showFavorite = false,
  onToggleFavorite,
  showCart = false,
  onAddToCart,
}: ProductCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const showArtist = variant !== "homeRecommendation";
  const overlayGradientHeight = variant === "homeRecommendation" ? "52%" : "48%";

  const favoriteButtonSize = variant === "homeRecommendation" ? 18 : 20;
  const favoriteButtonBg =
    variant === "homeRecommendation" ? "bg-black/35" : "bg-white/25";
  const favoriteButtonClassName = variant === "homeRecommendation"
    ? "h-8 w-8 right-2 top-2"
    : "h-9 w-9 right-2 top-2";

  const showTitleInSmall = variant === "homeRecommendation";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${product.artist}`}
      onPress={handlePress}
      style={{ width, height }}
      className="overflow-hidden rounded-2xl active:opacity-95"
    >
      <View style={{ width, height }}>
        <Image
          source={product.cover}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.75)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: overlayGradientHeight,
          }}
        />

        {showFavorite ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(product.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? `Desfavoritar ${product.title}` : `Favoritar ${product.title}`
            }
            hitSlop={8}
            className={`absolute items-center justify-center rounded-full ${favoriteButtonBg} ${favoriteButtonClassName} active:opacity-80`}
          >
            {isFavorite ? (
              <Ionicons
                name="heart"
                size={favoriteButtonSize}
                color="#E14842"
              />
            ) : (
              <Ionicons
                name="heart-outline"
                size={favoriteButtonSize}
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
            className={`${
              showTitleInSmall ? "font-golos text-xs" : "font-sans text-base"
            } text-white`}
            numberOfLines={1}
          >
            {product.title}
          </Text>
          {showArtist ? (
            <Text className="mt-0.5 font-golos text-sm text-white/80" numberOfLines={1}>
              {product.artist}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

