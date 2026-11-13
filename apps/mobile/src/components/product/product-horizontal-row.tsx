import { ScrollView, useWindowDimensions, View } from "react-native";
import type { ProductCatalogItem } from "@/services/products";
import { ProductCard } from "./product-card";

type ProductHorizontalRowProps = {
  items: ProductCatalogItem[];
  variant?: "carousel" | "compact";
};

const HORIZONTAL_PADDING = 16;
const COMPACT_CARD_COUNT = 3;

export const ProductHorizontalRow = ({
  items,
  variant = "carousel",
}: ProductHorizontalRowProps) => {
  const { width } = useWindowDimensions();
  const isCompact = variant === "compact";
  const gap = isCompact ? 10 : 12;
  const availableWidth = width - HORIZONTAL_PADDING * 2;
  const cardWidth = isCompact
    ? (availableWidth - gap * (COMPACT_CARD_COUNT - 1)) / COMPACT_CARD_COUNT
    : Math.min(168, (availableWidth - gap) * 0.46);
  const cards = items.map((item) => (
    <ProductCard key={item.id} product={item} width={cardWidth} />
  ));

  if (isCompact) {
    return <View style={{ flexDirection: "row", gap }}>{cards}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4"
      contentContainerStyle={{ gap, paddingRight: 20 }}
    >
      {cards}
    </ScrollView>
  );
};
