import {
  albums,
  artists,
  db,
  productImages,
  products,
  wishlists,
} from "@spinova/database";
import { and, asc, eq } from "@spinova/database/query";

import type {
  AddWishlistResult,
  IWishlistRepository,
  RemoveWishlistResult,
} from "../../application/ports/wishlist.repository.interface.ts";
import type { WishlistItem } from "../../application/wishlist-item.ts";
import {
  mapProductCatalogItem,
  primaryImageJoinCondition,
  productCatalogSelection,
  type ProductCatalogRow,
} from "../../../../database/read-models/product-catalog.read-model.ts";

type WishlistProductRow = ProductCatalogRow & {
  wishlistId: string;
  createdAt: Date;
};

export class DrizzleWishlistRepository implements IWishlistRepository {
  async findByUserId(userId: string): Promise<WishlistItem[]> {
    const rows = await db
      .select({
        wishlistId: wishlists.id,
        createdAt: wishlists.createdAt,
        ...productCatalogSelection,
      })
      .from(wishlists)
      .innerJoin(products, eq(products.id, wishlists.productId))
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(productImages, primaryImageJoinCondition)
      .where(eq(wishlists.userId, userId))
      .orderBy(asc(wishlists.createdAt));

    return rows.map((row: WishlistProductRow) => ({
      id: row.wishlistId,
      product: mapProductCatalogItem(row),
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async add(userId: string, productId: string): Promise<AddWishlistResult> {
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return { kind: "product-not-found" };
    }

    const [row] = await db
      .insert(wishlists)
      .values({ userId, productId })
      .onConflictDoNothing({
        target: [wishlists.userId, wishlists.productId],
      })
      .returning();

    if (!row) {
      return { kind: "duplicate" };
    }

    return {
      kind: "added",
      entry: {
        id: row.id,
        productId: row.productId,
        createdAt: row.createdAt.toISOString(),
      },
    };
  }

  async remove(
    userId: string,
    productId: string,
  ): Promise<RemoveWishlistResult> {
    const [row] = await db
      .delete(wishlists)
      .where(
        and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)),
      )
      .returning();

    if (!row) {
      return { kind: "not-found" };
    }

    return { kind: "removed" };
  }
}
