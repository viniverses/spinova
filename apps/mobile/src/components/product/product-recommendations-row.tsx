import { ScrollView, useWindowDimensions } from "react-native";
import type { Product } from "../../data/products-content";
import { ProductCard } from "./product-card";

type ProductRecommendationsRowProps = {
  items: Product[];
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
};

const CARD_GAP = 12;

export const ProductRecommendationsRow = ({
  items,
  favoriteIds,
  onToggleFavorite,
}: ProductRecommendationsRowProps) => {
  const { width } = useWindowDimensions();
  const horizontalPad = 16;
  const cardWidth = Math.min(148, (width - horizontalPad * 2 - CARD_GAP) * 0.42);
  const cardHeight = cardWidth * 0.72;

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
          variant="homeRecommendation"
          showFavorite
          isFavorite={favoriteIds.has(item.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ScrollView>
  );
};

