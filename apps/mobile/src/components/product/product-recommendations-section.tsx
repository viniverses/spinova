import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useProducts } from "@/hooks/use-products";
import { colors } from "@/lib/theme";
import { ProductRecommendationsRow } from "./product-recommendations-row";

type ProductRecommendationsSectionProps = {
  productId: string;
};

export const ProductRecommendationsSection = ({
  productId,
}: ProductRecommendationsSectionProps) => {
  const recommendations = useProducts({
    collection: "recommendations",
    pageSize: 10,
  });
  const items =
    recommendations.data?.data
      .filter((candidate) => candidate.id !== productId)
      .slice(0, 3) ?? [];

  return (
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
      ) : items.length > 0 ? (
        <ProductRecommendationsRow items={items} />
      ) : (
        <View className="h-24 items-center justify-center rounded-xl bg-[#262427] px-5">
          <Text className="text-center font-golos text-xs text-white/65">
            Nenhuma recomendação disponível no momento.
          </Text>
        </View>
      )}
    </View>
  );
};
