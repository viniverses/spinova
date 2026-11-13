import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { HomeSectionTitle } from "@/components/home/home-section-title";
import { ProductHorizontalRow } from "@/components/product/product-horizontal-row";
import { colors } from "@/lib/theme";
import type { ProductCatalogItem } from "@/services/products";

type HomeProductSectionProps = {
  title: string;
  items?: ProductCatalogItem[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  errorMessage: string;
  emptyMessage: string;
  className?: string;
};

export const HomeProductSection = ({
  title,
  items = [],
  isPending,
  isError,
  onRetry,
  errorMessage,
  emptyMessage,
  className = "pt-6",
}: HomeProductSectionProps) => {
  return (
    <View className={className}>
      <HomeSectionTitle title={title} />
      {isPending ? (
        <ActivityIndicator className="my-8" color={colors.primary.DEFAULT} />
      ) : isError ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          className="mx-4 rounded-2xl bg-[#262329] px-4 py-5 active:opacity-80"
        >
          <Text className="text-center font-golos text-sm text-white/80">
            {errorMessage}
          </Text>
        </Pressable>
      ) : items.length === 0 ? (
        <Text className="px-4 font-golos text-sm text-white/60">
          {emptyMessage}
        </Text>
      ) : (
        <ProductHorizontalRow items={items} />
      )}
    </View>
  );
};
