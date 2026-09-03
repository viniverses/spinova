import { ScrollView, useWindowDimensions } from "react-native";
import { ProductCard } from "@/components/product/product-card";
import type { ProductCatalogItem } from "@/services/products";

type HomeRecommendationRowProps = {
  items: ProductCatalogItem[];
};

const CARD_GAP = 12;

export const HomeRecommendationRow = ({
  items,
}: HomeRecommendationRowProps) => {
  const { width } = useWindowDimensions();
  const horizontalPad = 16;
  const cardWidth = Math.min(
    168,
    (width - horizontalPad * 2 - CARD_GAP) * 0.46,
  );
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4"
      contentContainerStyle={{ gap: CARD_GAP, paddingRight: 20 }}
    >
      {items.map((item) => (
        <ProductCard key={item.id} product={item} width={cardWidth} />
      ))}
    </ScrollView>
  );
};
