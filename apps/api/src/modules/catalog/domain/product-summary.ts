export interface ArtistSummary {
  id: string;
  name: string;
  slug: string;
}

export type ProductFormat = "vinyl" | "cd" | "cassette";
export type ProductEdition = "standard" | "deluxe" | "colored";

export interface ProductImage {
  url: string;
  altText: string | null;
}

export interface ProductSummary {
  id: string;
  albumId: string;
  title: string;
  artist: ArtistSummary;
  sku: string;
  format: ProductFormat;
  edition: ProductEdition;
  price: string;
  compareAtPrice: string | null;
  currency: "BRL";
  stockQuantity: number;
  inStock: boolean;
  isImported: boolean;
  genre: string | null;
  releaseDate: string | null;
  image: ProductImage | null;
}
