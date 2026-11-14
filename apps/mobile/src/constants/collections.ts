import type { Ionicons } from "@expo/vector-icons";
import type { ImageSource } from "expo-image";
import type { ComponentProps } from "react";
import type { ProductListParams } from "@/services/products";

type CollectionMetadata = {
  label: string;
  params: ProductListParams;
  emptyMessage: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  homeIcon?: ImageSource;
  image?: ImageSource;
};

const COLLECTIONS = {
  bestsellers: {
    icon: "flame",
    homeIcon: require("../../assets/svg/best-sellers.svg"),
    image: require("../../assets/categories/best-sellers.png"),
    params: { collection: "bestsellers" },
    label: "Mais vendidos",
    emptyMessage: "Nenhum produto mais vendido no momento.",
  },
  new: {
    icon: "sparkles-outline",
    homeIcon: require("../../assets/svg/new.svg"),
    params: { collection: "new" },
    label: "Novos",
    emptyMessage: "Nenhum produto novo no momento.",
  },
  promo: {
    icon: "pricetag",
    homeIcon: require("../../assets/svg/sales.svg"),
    image: require("../../assets/categories/sales.png"),
    params: { collection: "promotions" },
    label: "Promoções",
    emptyMessage: "Nenhuma promoção disponível no momento.",
  },
  import: {
    icon: "globe-outline",
    homeIcon: require("../../assets/svg/imported.svg"),
    image: require("../../assets/categories/imported.png"),
    params: { collection: "imported" },
    label: "Importados",
    emptyMessage: "Nenhum produto importado disponível no momento.",
  },
  national: {
    icon: "map-outline",
    homeIcon: require("../../assets/svg/national.svg"),
    image: require("../../assets/categories/national.png"),
    params: { collection: "national" },
    label: "Nacionais",
    emptyMessage: "Nenhum produto nacional disponível no momento.",
  },
  "r-and-b": {
    icon: "musical-notes-outline",
    params: { category: "r-and-b" },
    label: "RNB",
    emptyMessage: "Nenhum produto de R&B ou soul encontrado.",
  },
  electronic: {
    icon: "pulse",
    params: { category: "electronic" },
    label: "Eletrônico",
    emptyMessage: "Nenhum produto eletrônico encontrado.",
  },
  pop: {
    icon: "mic-outline",
    params: { category: "indie-pop" },
    label: "Pop",
    emptyMessage: "Nenhum produto pop encontrado.",
  },
  alternative: {
    icon: "color-wand-outline",
    params: { category: "alternative-pop" },
    label: "Alternativo",
    emptyMessage: "Nenhum produto indie ou alternativo encontrado.",
  },
  rock: {
    icon: "flash-outline",
    params: { category: "art-rock" },
    label: "Rock",
    emptyMessage: "Nenhum produto de rock encontrado.",
  },
  folk: {
    icon: "leaf-outline",
    params: { genre: "Folk" },
    label: "Country",
    emptyMessage: "Nenhum produto folk ou country encontrado.",
  },
  rap: {
    icon: "mic-outline",
    params: { category: "hip-hop" },
    label: "Hip Hop",
    emptyMessage: "Nenhum produto de rap ou hip-hop encontrado.",
  },
  all: {
    icon: "grid-outline",
    params: {},
    label: "Todos",
    emptyMessage: "Nenhum produto encontrado.",
  },
  "city-pop": {
    icon: "moon-outline",
    params: { category: "city-pop" },
    label: "City Pop",
    emptyMessage: "Nenhum produto de city pop encontrado.",
  },
  reggaeton: {
    icon: "flame-outline",
    params: { category: "reggaeton" },
    label: "Reggaeton",
    emptyMessage: "Nenhum produto de reggaeton encontrado.",
  },
  experimental: {
    icon: "flask-outline",
    params: { category: "experimental" },
    label: "Experimental",
    emptyMessage: "Nenhum produto experimental encontrado.",
  },
} satisfies Record<string, CollectionMetadata>;

export type CollectionId = keyof typeof COLLECTIONS;

export function getCollection<Id extends CollectionId>(id: Id) {
  return {
    ...COLLECTIONS[id],
    id,
    href: { pathname: "/collection/[id]", params: { id } } as const,
  };
}

export function findCollection(id: string) {
  return Object.hasOwn(COLLECTIONS, id)
    ? getCollection(id as CollectionId)
    : undefined;
}

export const HOME_COLLECTIONS = (
  ["bestsellers", "new", "promo", "import", "national"] as const
).map(getCollection);

export const FEATURED_COLLECTIONS = (
  ["bestsellers", "promo", "national", "import"] as const
).map(getCollection);

export const GENRE_COLLECTIONS = (
  [
    "new",
    "r-and-b",
    "electronic",
    "pop",
    "alternative",
    "rock",
    "folk",
    "rap",
    "city-pop",
    "reggaeton",
    "experimental",
  ] as const
).map(getCollection);

// Keep all products last in the category buttons.
export const CATEGORY_BUTTONS = [
  ...GENRE_COLLECTIONS.map((collection) => ({
    ...collection,
    featured: false,
  })),
  { ...getCollection("all"), featured: true },
];
