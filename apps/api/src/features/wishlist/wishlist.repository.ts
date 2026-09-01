import { RepositoryError } from "../../errors/index.ts";
import { albums, artists, db, products, wishlists } from "@repo/database";
import { and, asc, eq } from "@repo/database/query";

export const getWishlistByUserId = async (userId: string) => {
  try {
    const rows = await db
      .select({
        id: wishlists.id,
        productId: products.id,
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
        createdAt: wishlists.createdAt,
      })
      .from(wishlists)
      .innerJoin(products, eq(products.id, wishlists.productId))
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .where(eq(wishlists.userId, userId))
      .orderBy(asc(wishlists.createdAt));

    return rows.map((row) => ({
      id: row.id,
      product: {
        id: row.productId,
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
      },
      createdAt: row.createdAt.toISOString(),
    }));
  } catch (error) {
    throw new RepositoryError("list", "wishlists", error);
  }
};

export const addToWishlist = async (userId: string, productId: string) => {
  try {
    const [row] = await db
      .insert(wishlists)
      .values({ userId, productId })
      .onConflictDoNothing({
        target: [wishlists.userId, wishlists.productId],
      })
      .returning();
    return row ?? null;
  } catch (error) {
    throw new RepositoryError("insert", "wishlists", error);
  }
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  try {
    const [row] = await db
      .delete(wishlists)
      .where(
        and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)),
      )
      .returning();
    return row ?? null;
  } catch (error) {
    throw new RepositoryError("delete", "wishlists", error);
  }
};
