import { albums, artists, cartItems, carts, db, productImages, products } from "@spinova/database";
import { asc, eq } from "@spinova/database/query";
import {
  mapProductCatalogItem,
  primaryImageJoinCondition,
  productCatalogSelection,
} from "../../../../database/read-models/product-catalog.read-model.ts";
import type { CartReadModel, CartReader } from "../../application/ports/cart-reader.interface.ts";

export class DrizzleCartReader implements CartReader {
  async getCartByUserId(userId: string): Promise<CartReadModel> {
    const [cart] = await db.select({ id: carts.id }).from(carts)
      .where(eq(carts.userId, userId)).limit(1);
    if (!cart) return { id: null, items: [] };

    const rows = await db.select({
      itemId: cartItems.id,
      quantity: cartItems.quantity,
      ...productCatalogSelection,
    }).from(cartItems)
      .innerJoin(products, eq(products.id, cartItems.productId))
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(productImages, primaryImageJoinCondition)
      .where(eq(cartItems.cartId, cart.id)).orderBy(asc(cartItems.id));

    return {
      id: cart.id,
      items: rows.map((row) => ({
        id: row.itemId,
        quantity: row.quantity,
        product: mapProductCatalogItem(row),
      })),
    };
  }
}
