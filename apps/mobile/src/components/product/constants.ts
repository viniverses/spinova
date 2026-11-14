import type { ProductEdition } from "@/services/products";

export const EDITION_LABELS = {
  standard: "Padrão",
  deluxe: "Deluxe",
  colored: "Colorido",
} as const satisfies Record<ProductEdition, string>;

export const PLACEHOLDER_ALBUM_IMAGES = [2, 3, 4].map((position) => ({
  url: `https://placehold.co/900x900/2A272B/FFFFFF/png?text=Capa+${position}`,
  altText: `Imagem provisória da capa ${position}`,
}));
