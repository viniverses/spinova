import { ScrollView, useWindowDimensions } from "react-native";
import type { ProductCatalogItem } from "@/services/products";
import { ProductCard } from "../product/product-card";

type HomeReleaseRowProps = {
  items: ProductCatalogItem[];
};

const CARD_GAP = 12;

export const HomeReleaseRow = ({ items }: HomeReleaseRowProps) => {
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
