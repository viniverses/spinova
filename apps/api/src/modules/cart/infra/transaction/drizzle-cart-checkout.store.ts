import { albums, artists, cartItems, carts, productImages, products } from "@spinova/database";
import { and, asc, eq } from "@spinova/database/query";
import type { CartCheckoutStore, CheckoutCartSnapshot } from "../../application/ports/cart-checkout-store.interface.ts";
import type { DatabaseTransaction } from "../../../../database/transaction.ts";

export class DrizzleCartCheckoutStore implements CartCheckoutStore {
  constructor(private readonly tx: DatabaseTransaction) {}

  async getCartForUpdate(
    userId: string,
  ): Promise<CheckoutCartSnapshot | null> {
    const [cart] = await this.tx
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1)
      .for("update");

    if (!cart) return null;

    const items = await this.tx
      .select({
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        price: products.price,
        title: albums.title,
        artistName: artists.name,
        format: products.format,
        imageUrl: productImages.url,
        imageAltText: productImages.altText,
      })
      .from(cartItems)
      .innerJoin(products, eq(products.id, cartItems.productId))
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(
        productImages,
        and(
          eq(productImages.productId, products.id),
          eq(productImages.position, 0),
        ),
      )
      .where(eq(cartItems.cartId, cart.id))
      .orderBy(asc(cartItems.id));

    return {
      id: cart.id,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        product: {
          id: item.productId,
          title: item.title,
          artist: { name: item.artistName },
          format: item.format,
          image: item.imageUrl
            ? { url: item.imageUrl, altText: item.imageAltText }
            : null,
        },
      })),
    };
  }

  async clearCart(
    cartId: string,
  ): Promise<void> {
    await this.tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
  }
}
