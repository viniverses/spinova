import {
  cartItems,
  carts,
  db,
  products,
} from "@spinova/database";
import { and, asc, eq } from "@spinova/database/query";

import { Cart, CartItemEntity } from "../../domain/entities/index.ts";
import type { ICartRepository } from "../../domain/repositories/cart.repository.interface.ts";

import { RepositoryError } from "../../../../database/errors/repository.ts";
import { ConcurrentCartUpdateError } from "../../domain/cart.errors.ts";


type DatabaseTransaction = Parameters<typeof db.transaction>[0] extends (
  tx: infer Transaction,
) => unknown
  ? Transaction
  : never;

export class DrizzleCartRepository implements ICartRepository {
  private async getOrCreateCartId(
    tx: DatabaseTransaction,
    userId: string,
  ): Promise<string> {
    const [cart] = await tx
      .insert(carts)
      .values({ userId })
      .onConflictDoUpdate({
        target: carts.userId,
        set: { userId },
      })
      .returning({ id: carts.id });

    if (!cart) {
      throw new RepositoryError("insert", "carts");
    }
    return cart.id;
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    const [cart] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (!cart) {
      return Cart.empty();
    }

    const rows = await db
      .select({
        itemId: cartItems.id,
        quantity: cartItems.quantity,
        productId: products.id,
        price: products.price,
      })
      .from(cartItems)
      .innerJoin(products, eq(products.id, cartItems.productId))
      .where(eq(cartItems.cartId, cart.id))
      .orderBy(asc(cartItems.id));

    const items = rows.map(
      (row) =>
        new CartItemEntity(
          row.itemId,
          row.quantity,
          { id: row.productId, price: row.price },
        ),
    );

    return new Cart(cart.id, items);
  }

  async save(
    userId: string,
    cart: Cart,
    expectedCart: Cart,
  ): Promise<void> {
    await db.transaction(async (tx: DatabaseTransaction) => {
      let cartId = cart.id;

      if (!expectedCart.id) {
        cartId ??= await this.getOrCreateCartId(tx, userId);
      }

      const [lockedCart] = await tx
        .select({ id: carts.id })
        .from(carts)
        .where(
          expectedCart.id
            ? and(eq(carts.id, expectedCart.id), eq(carts.userId, userId))
            : and(eq(carts.id, cartId as string), eq(carts.userId, userId)),
        )
        .limit(1)
        .for("update");

      if (expectedCart.id && !lockedCart) {
        throw new ConcurrentCartUpdateError();
      }

      if (lockedCart) {
        const currentItems = await tx
          .select({
            id: cartItems.id,
            productId: cartItems.productId,
            quantity: cartItems.quantity,
          })
          .from(cartItems)
          .where(eq(cartItems.cartId, lockedCart.id));

        const expectedItems = expectedCart.items
          .map((item) => ({
            id: item.id,
            productId: item.product.id,
            quantity: item.quantity,
          }))
          .sort((left, right) => left.productId.localeCompare(right.productId));
        const actualItems = currentItems
          .map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
          }))
          .sort((left, right) => left.productId.localeCompare(right.productId));

        const unchanged =
          expectedItems.length === actualItems.length &&
          expectedItems.every((expected, index) => {
            const actual = actualItems[index];
            return Boolean(
              actual &&
                actual.productId === expected.productId &&
                actual.quantity === expected.quantity &&
                (expected.id === undefined || expected.id === actual.id),
            );
          });

        if (!unchanged) throw new ConcurrentCartUpdateError();
        cartId = lockedCart.id;
      }

      cartId ??= await this.getOrCreateCartId(tx, userId);

      await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));

      if (cart.items.length > 0) {
        await tx.insert(cartItems).values(
          cart.items.map((item) =>
            item.id
              ? {
                  id: item.id,
                  cartId,
                  productId: item.product.id,
                  quantity: item.quantity,
                }
              : {
                  cartId,
                  productId: item.product.id,
                  quantity: item.quantity,
                },
          ),
        );
      }
    });
  }
}
