import { StatusBar } from "expo-status-bar";
import { colors } from "@/lib/theme";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { HomeBannerCarousel } from "@/components/home/home-banner-carousel";
import { HomeCategoryGrid } from "@/components/home/home-category-grid";
import { HomeRecommendationRow } from "@/components/home/home-recommendation-row";
import { HomeReleaseRow } from "@/components/home/home-release-row";
import { HomeSectionTitle } from "@/components/home/home-section-title";
import { useProducts } from "@/hooks/use-products";

const SCROLL_BOTTOM_PADDING = 112;

export default function HomeScreen() {
  const releases = useProducts({ collection: "releases", pageSize: 10 });

  const recommendations = useProducts({
    collection: "recommendations",
    pageSize: 10,
  });

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
      >
        <HomeBannerCarousel />

        <HomeCategoryGrid />

        <View className="pt-4">
          <HomeSectionTitle title="Lançamentos" />
          {releases.isPending ? (
            <ActivityIndicator
              className="my-8"
              color={colors.primary.DEFAULT}
            />
          ) : releases.isError ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => void releases.refetch()}
              className="mx-4 rounded-2xl bg-[#262329] px-4 py-5 active:opacity-80"
            >
              <Text className="text-center font-golos text-sm text-white/80">
                Não foi possível carregar os lançamentos. Toque para tentar
                novamente.
              </Text>
            </Pressable>
          ) : releases.data.data.length === 0 ? (
            <Text className="px-4 font-golos text-sm text-white/60">
              Nenhum lançamento disponível no momento.
            </Text>
          ) : (
            <HomeReleaseRow items={releases.data.data} />
          )}
        </View>

        <View className="pt-6">
          <HomeSectionTitle title="Recomendações" />
          {recommendations.isPending ? (
            <ActivityIndicator
              className="my-8"
              color={colors.primary.DEFAULT}
            />
          ) : recommendations.isError ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => void recommendations.refetch()}
              className="mx-4 rounded-2xl bg-[#262329] px-4 py-5 active:opacity-80"
            >
              <Text className="text-center font-golos text-sm text-white/80">
                Não foi possível carregar as recomendações. Toque para tentar
                novamente.
              </Text>
            </Pressable>
          ) : recommendations.data.data.length === 0 ? (
            <Text className="px-4 font-golos text-sm text-white/60">
              Nenhuma recomendação disponível no momento.
            </Text>
          ) : (
            <HomeRecommendationRow items={recommendations.data.data} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
