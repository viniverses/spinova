import { ScrollView, useWindowDimensions } from "react-native";
import type { Product } from "../../../data/products-content";
import { ProductCard } from "@/components/product/product-card";

type HomeRecommendationRowProps = {
  items: Product[];
  favoriteIds: Set<string>;
  onToggleFavorite: (productId: string) => void;
};

const CARD_GAP = 12;

export const HomeRecommendationRow = ({
  items,
  favoriteIds,
  onToggleFavorite,
}: HomeRecommendationRowProps) => {
  const { width } = useWindowDimensions();
  const horizontalPad = 16;
  const cardWidth = Math.min(
    168,
    (width - horizontalPad * 2 - CARD_GAP) * 0.46,
  );
  const cardHeight = cardWidth;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4"
      contentContainerStyle={{ gap: CARD_GAP, paddingRight: 20 }}
    >
      {items.map((item) => (
        <ProductCard
          key={item.id}
          product={item}
          width={cardWidth}
          height={cardHeight}
          variant="homeRelease"
          showFavorite
          isFavorite={favoriteIds.has(item.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ScrollView>
  );
};
