import { albums, artists, productImages, products } from "@spinova/database";
import { and, eq } from "@spinova/database/query";

export const primaryImageJoinCondition = and(
  eq(productImages.productId, products.id),
  eq(productImages.position, 0),
);

export const productCatalogSelection = {
  id: products.id,
  albumId: albums.id,
  title: albums.title,
  artistId: artists.id,
  artistName: artists.name,
  artistSlug: artists.slug,
  sku: products.sku,
  format: products.format,
  edition: products.edition,
  price: products.price,
  compareAtPrice: products.compareAtPrice,
  stockQuantity: products.stockQuantity,
  isImported: products.isImported,
  genre: albums.genre,
  releaseDate: albums.releaseDate,
  imageUrl: productImages.url,
  imageAltText: productImages.altText,
};

export type ProductCatalogRow = {
  id: string;
  albumId: string;
  title: string;
  artistId: string;
  artistName: string;
  artistSlug: string;
  sku: string;
  format: "vinyl" | "cd" | "cassette";
  edition: "standard" | "deluxe" | "colored";
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isImported: boolean;
  genre: string | null;
  releaseDate: string | null;
  imageUrl: string | null;
  imageAltText: string | null;
};

export const mapProductCatalogItem = (row: ProductCatalogRow) => ({
  id: row.id,
  albumId: row.albumId,
  title: row.title,
  artist: {
    id: row.artistId,
    name: row.artistName,
    slug: row.artistSlug,
  },
  sku: row.sku,
  format: row.format,
  edition: row.edition,
  price: row.price,
  compareAtPrice: row.compareAtPrice,
  currency: "BRL" as const,
  stockQuantity: row.stockQuantity,
  inStock: row.stockQuantity > 0,
  isImported: row.isImported,
  genre: row.genre,
  releaseDate: row.releaseDate,
  image:
    row.imageUrl === null
      ? null
      : { url: row.imageUrl, altText: row.imageAltText },
});
