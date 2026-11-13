import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { RefreshControl, ScrollView, View } from "react-native";
import { HomeBannerCarousel } from "@/components/home/home-banner-carousel";
import { HomeCategoryGrid } from "@/components/home/home-category-grid";
import { HomeProductSection } from "@/components/home/home-product-section";
import { useProducts } from "@/hooks/use-products";
import { colors } from "@/lib/theme";

const SCROLL_BOTTOM_PADDING = 112;

export default function HomeScreen() {
  const releases = useProducts({ collection: "releases", pageSize: 10 });

  const recommendations = useProducts({
    collection: "recommendations",
    pageSize: 10,
  });

  const isRefreshing = releases.isRefetching || recommendations.isRefetching;

  const handleRefresh = useCallback(async () => {
    await Promise.all([releases.refetch(), recommendations.refetch()]);
  }, [releases, recommendations]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SCROLL_BOTTOM_PADDING,
        }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary.DEFAULT}
            colors={[colors.primary.DEFAULT]}
          />
        }
      >
        <HomeBannerCarousel />

        <HomeCategoryGrid />

        <HomeProductSection
          title="Lançamentos"
          items={releases.data?.data}
          isPending={releases.isPending}
          isError={releases.isError}
          onRetry={() => void releases.refetch()}
          errorMessage="Não foi possível carregar os lançamentos. Toque para tentar novamente."
          emptyMessage="Nenhum lançamento disponível no momento."
          className="pt-4"
        />

        <HomeProductSection
          title="Recomendações"
          items={recommendations.data?.data}
          isPending={recommendations.isPending}
          isError={recommendations.isError}
          onRetry={() => void recommendations.refetch()}
          errorMessage="Não foi possível carregar as recomendações. Toque para tentar novamente."
          emptyMessage="Nenhuma recomendação disponível no momento."
          className="pt-6"
        />
      </ScrollView>
    </View>
  );
}
