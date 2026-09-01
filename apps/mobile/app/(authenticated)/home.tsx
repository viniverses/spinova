import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeBannerCarousel } from "@/components/home/home-banner-carousel";
import { HelpDrawer } from "@/components/help/help-drawer";
import { HomeCategoryGrid } from "@/components/home/home-category-grid";
import { HomeHeader } from "@/components/home/home-header";
import { HomeRecommendationRow } from "@/components/home/home-recommendation-row";
import { HomeReleaseRow } from "@/components/home/home-release-row";
import { HomeSectionTitle } from "@/components/home/home-section-title";
import { HOME_RECOMMENDATIONS, HOME_RELEASES } from "../../data/home-content";

const SCROLL_BOTTOM_PADDING = 112;

export default function HomeScreen() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      next.add(id);
      return next;
    });
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <SafeAreaView className="bg-black" edges={["top", "left", "right"]}>
        <HomeHeader onPressHelp={() => setIsHelpOpen(true)} />
      </SafeAreaView>

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
          <HomeReleaseRow
            items={HOME_RELEASES}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        </View>

        <View className="pt-6">
          <HomeSectionTitle title="Recomendações" />
          <HomeRecommendationRow
            items={HOME_RECOMMENDATIONS}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        </View>
      </ScrollView>

      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </View>
  );
}
