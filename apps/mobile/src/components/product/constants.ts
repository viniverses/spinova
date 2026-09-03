import type { ProductListParams } from "@/services/products";

type ProductCollectionConfig = {
  params: ProductListParams;
  title: string;
  emptyMessage: string;
};

export const COLLECTION_CONFIG: Record<string, ProductCollectionConfig> = {
  bestsellers: {
    params: { collection: "bestsellers" },
    title: "Mais vendidos",
    emptyMessage: "Nenhum produto mais vendido no momento.",
  },
  new: {
    params: { collection: "new" },
    title: "Novos",
    emptyMessage: "Nenhum produto novo no momento.",
  },
  promo: {
    params: { collection: "promotions" },
    title: "Promoções",
    emptyMessage: "Nenhuma promoção disponível no momento.",
  },
  import: {
    params: { collection: "imported" },
    title: "Importados",
    emptyMessage: "Nenhum produto importado disponível no momento.",
  },
  national: {
    params: { collection: "national" },
    title: "Nacionais",
    emptyMessage: "Nenhum produto nacional disponível no momento.",
  },
  "r-and-b": {
    params: { category: "r-and-b" },
    title: "RNB",
    emptyMessage: "Nenhum produto de R&B ou soul encontrado.",
  },
  electronic: {
    params: { category: "electronic" },
    title: "Eletrônico",
    emptyMessage: "Nenhum produto eletrônico encontrado.",
  },
  pop: {
    params: { category: "indie-pop" },
    title: "Pop",
    emptyMessage: "Nenhum produto pop encontrado.",
  },
  alternative: {
    params: { category: "alternative-pop" },
    title: "Alternativo",
    emptyMessage: "Nenhum produto indie ou alternativo encontrado.",
  },
  rock: {
    params: { category: "art-rock" },
    title: "Rock",
    emptyMessage: "Nenhum produto de rock encontrado.",
  },
  folk: {
    params: { genre: "Folk" },
    title: "Country",
    emptyMessage: "Nenhum produto folk ou country encontrado.",
  },
  rap: {
    params: { category: "hip-hop" },
    title: "Hip Hop",
    emptyMessage: "Nenhum produto de rap ou hip-hop encontrado.",
  },
  all: {
    params: {},
    title: "Todos",
    emptyMessage: "Nenhum produto encontrado.",
  },
  "city-pop": {
    params: { category: "city-pop" },
    title: "City Pop",
    emptyMessage: "Nenhum produto de city pop encontrado.",
  },
  reggaeton: {
    params: { category: "reggaeton" },
    title: "Reggaeton",
    emptyMessage: "Nenhum produto de reggaeton encontrado.",
  },
  experimental: {
    params: { category: "experimental" },
    title: "Experimental",
    emptyMessage: "Nenhum produto experimental encontrado.",
  },
};
