import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { ProductDetailHero } from "@/components/product/product-detail-hero";
import { ProductCard } from "@/components/product/product-card";
import { useProduct, useProducts } from "@/hooks/use-products";
import { colors } from "@/lib/theme";

const formatPrice = (value: string) =>
  `R$${Number(value).toFixed(2).replace(".", ",")}`;

const editionLabels = {
  standard: "Padrão",
  deluxe: "Deluxe",
  colored: "Colorido",
} as const;

const placeholderAlbumImages = [2, 3, 4].map((position) => ({
  url: `https://placehold.co/900x900/2A272B/FFFFFF/png?text=Capa+${position}`,
  altText: `Imagem provisória da capa ${position}`,
}));

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const [isAdded, setIsAdded] = useState(false);
  const product = useProduct(id ?? "");
  const recommendations = useProducts({
    collection: "recommendations",
    pageSize: 10,
  });

  if (product.isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <StatusBar style="light" />
        <ActivityIndicator color={colors.primary.DEFAULT} size="large" />
        <Text className="mt-4 font-golos text-sm text-white/70">
          Carregando produto…
        </Text>
      </View>
    );
  }

  if (product.isError || !product.data) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-8">
        <StatusBar style="light" />
        <Ionicons name="disc-outline" size={54} color="#777179" />
        <Text className="mt-4 text-center font-sans text-lg text-white">
          Não foi possível carregar este disco
        </Text>
        <Pressable
          onPress={() => void product.refetch()}
          accessibilityRole="button"
          className="mt-5 min-h-12 items-center justify-center rounded-xl bg-primary px-6 active:opacity-85"
        >
          <Text className="font-golos-semibold text-base text-white">
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  const item = product.data;
  const heroWidth = width - 32;
  const year = item.releaseDate
    ? new Date(item.releaseDate).getFullYear()
    : null;
  const details = [
    year,
    item.genre,
    item.format.toUpperCase(),
    editionLabels[item.edition],
  ].filter(Boolean);
  const recommendedItems =
    recommendations.data?.data
      .filter((candidate) => candidate.id !== item.id)
      .slice(0, 3) ?? [];
  const recommendationCardWidth = (width - 32 - 20) / 3;
  const albumImages = [
    ...(item.images.length > 0 ? item.images : item.image ? [item.image] : []),
    ...placeholderAlbumImages,
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
                {formatPrice(item.price)}
              </Text>
              <Text className="mt-1 font-golos text-xs text-white">
                + Frete: Calcular
              </Text>
              <Text className="mt-0.5 font-golos-semibold text-xs text-white">
                Total:{" "}
                <Text className="font-golos">{formatPrice(item.price)}</Text>
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setIsAdded(true)}
            disabled={!item.inStock}
            accessibilityRole="button"
            accessibilityLabel={
              item.inStock ? "Adicionar ao carrinho" : "Produto esgotado"
            }
            accessibilityState={{ disabled: !item.inStock }}
            className="mt-5 min-h-[50px] flex-row items-center justify-center gap-2 rounded-[11px] bg-primary px-5 active:opacity-85 disabled:bg-[#4D474E]"
          >
            <Text className="font-sans text-xl text-white">
              {!item.inStock
                ? "Produto esgotado"
                : isAdded
                  ? "Adicionado ao carrinho"
                  : "Adicione ao carrinho"}
            </Text>
            <Ionicons
              name={isAdded ? "checkmark-circle" : "cart"}
              size={24}
              color="#FFFFFF"
            />
          </Pressable>

          <View className="mt-5">
            <Text className="mb-2 font-sans text-base text-white">
              Você pode gostar
            </Text>
            {recommendations.isPending ? (
              <View className="h-24 items-center justify-center">
                <ActivityIndicator color={colors.primary.DEFAULT} />
              </View>
            ) : recommendations.isError ? (
              <Pressable
                onPress={() => void recommendations.refetch()}
                accessibilityRole="button"
                className="h-24 items-center justify-center rounded-xl bg-[#262427] px-5 active:opacity-80"
              >
                <Text className="text-center font-golos text-xs text-white/75">
                  Não foi possível carregar as recomendações. Toque para tentar
                  novamente.
                </Text>
              </Pressable>
            ) : recommendedItems.length > 0 ? (
              <View className="flex-row gap-2.5">
                {recommendedItems.map((recommendedItem) => (
                  <ProductCard
                    key={recommendedItem.id}
                    product={recommendedItem}
                    width={recommendationCardWidth}
                  />
                ))}
              </View>
            ) : (
              <View className="h-24 items-center justify-center rounded-xl bg-[#262427] px-5">
                <Text className="text-center font-golos text-xs text-white/65">
                  Nenhuma recomendação disponível no momento.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
