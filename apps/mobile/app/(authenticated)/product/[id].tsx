import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ProductDetailHero } from "@/components/product/product-detail-hero";
import {
  EDITION_LABELS,
  PLACEHOLDER_ALBUM_IMAGES,
} from "@/components/product/constants";
import { ProductRecommendationsSection } from "@/components/product/product-recommendations-section";
import { useAddToCart, useCartItemQuantity } from "@/hooks/use-cart";
import { useProduct } from "@/hooks/use-products";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/utils";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const product = useProduct(id ?? "");
  const cartQuantity = useCartItemQuantity(id ?? "");
  const addToCart = useAddToCart();

  if (product.isPending) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <LoadingState message="Carregando produto…" />
      </View>
    );
  }

  if (product.isError || !product.data) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <ErrorState
          icon={
            <Ionicons
              name="disc-outline"
              size={54}
              color={colors.muted.foreground}
            />
          }
          title="Não foi possível carregar este disco"
          onRetry={() => void product.refetch()}
        />
      </View>
    );
  }

  const item = product.data;
  const isAdded = (cartQuantity.data ?? 0) > 0;
  const isAtStockLimit =
    (cartQuantity.data ?? 0) >= Math.min(item.stockQuantity, 99);
  const heroWidth = width - 32;
  const year = item.releaseDate
    ? new Date(item.releaseDate).getFullYear()
    : null;
  const details = [
    year,
    item.genre,
    item.format.toUpperCase(),
    EDITION_LABELS[item.edition],
  ].filter(Boolean);
  const albumImages = [
    ...(item.images.length > 0 ? item.images : item.image ? [item.image] : []),
    ...PLACEHOLDER_ALBUM_IMAGES,
  ];

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-4 pt-2">
          <ProductDetailHero
            images={albumImages}
            title={item.title}
            width={heroWidth}
          />

          <View className="mt-6 flex-row justify-between gap-4">
            <View className="min-w-0 flex-1">
              <Text
                className="font-sans text-xl leading-6 text-white"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text className="mt-1 font-golos text-sm leading-[18px] text-white">
                {item.artist.name}
              </Text>
              <Text
                className="font-golos text-xs leading-4 text-white/90"
                numberOfLines={2}
              >
                {details.join(" • ")}
              </Text>
            </View>

            <View className="items-end pt-0.5">
              <Text className="font-golos-semibold text-base text-white">
                {formatCurrency(item.price)}
              </Text>
              <Text className="mt-1 font-golos text-xs text-white">
                + Frete: Calcular
              </Text>
              <Text className="mt-0.5 font-golos-semibold text-xs text-white">
                Total:{" "}
                <Text className="font-golos">{formatCurrency(item.price)}</Text>
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => addToCart.mutate(item.id)}
            disabled={!item.inStock || addToCart.isPending || isAtStockLimit}
            accessibilityRole="button"
            accessibilityLabel={
              !item.inStock
                ? "Produto esgotado"
                : isAtStockLimit
                  ? "Quantidade máxima no carrinho"
                  : "Adicionar ao carrinho"
            }
            accessibilityState={{
              disabled: !item.inStock || addToCart.isPending || isAtStockLimit,
              busy: addToCart.isPending,
            }}
            className="mt-5 min-h-[50px] flex-row items-center justify-center gap-2 rounded-[11px] bg-primary px-5 active:opacity-85 disabled:bg-[#4D474E]"
          >
            <Text className="font-sans text-xl text-white">
              {!item.inStock
                ? "Produto esgotado"
                : addToCart.isPending
                  ? "Adicionando…"
                  : isAtStockLimit
                    ? "Limite em estoque"
                    : isAdded
                      ? "Adicionado ao carrinho"
                      : "Adicione ao carrinho"}
            </Text>
            {addToCart.isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons
                name={isAdded ? "checkmark-circle" : "cart"}
                size={24}
                color="#FFFFFF"
              />
            )}
          </Pressable>

          {addToCart.isError ? (
            <Text
              accessibilityRole="alert"
              className="mt-2 font-golos text-xs text-error"
            >
              Não foi possível atualizar o carrinho. Tente novamente.
            </Text>
          ) : null}

          <ProductRecommendationsSection productId={item.id} />
        </View>
      </ScrollView>
    </View>
  );
}
