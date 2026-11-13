import { useWindowDimensions, View } from "react-native";
import type { ProductCatalogItem } from "@/services/products";
import { ProductCard } from "./product-card";

type ProductRecommendationsRowProps = {
  items: ProductCatalogItem[];
};

const CARD_GAP = 10;
const CARD_COUNT = 3;

export const ProductRecommendationsRow = ({
  items,
}: ProductRecommendationsRowProps) => {
  const { width } = useWindowDimensions();
  const horizontalPad = 16;
  const cardWidth =
    (width - horizontalPad * 2 - CARD_GAP * (CARD_COUNT - 1)) / CARD_COUNT;
  return (
    <View style={{ flexDirection: "row", gap: CARD_GAP }}>
      {items.map((item) => (
        <ProductCard key={item.id} product={item} width={cardWidth} />
      ))}
    </View>
  );
};
