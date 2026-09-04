import { RepositoryError } from "../../errors/index.ts";
import {
  addresses,
  cartItems,
  carts,
  db,
  inventoryMovements,
  orderItems,
  orders,
  products,
} from "@spinova/database";
import { and, asc, desc, eq, gte, sql } from "@spinova/database/query";

import { calculateOrderTotal } from "./order.pricing.ts";

type CheckoutFailure =
  | { status: "cart-empty" }
  | { status: "address-not-found" }
  | { status: "out-of-stock"; productId: string };

class CheckoutAbort extends Error {
  public readonly result: CheckoutFailure;

  constructor(result: CheckoutFailure) {
    super(result.status);
    this.result = result;
  }
}

export const createOrderFromCart = async (userId: string) => {
  try {
    return await db.transaction(async (transaction) => {
      const [cart] = await transaction
        .select({ id: carts.id })
        .from(carts)
        .where(eq(carts.userId, userId))
        .limit(1)
        .for("update");

      if (!cart) throw new CheckoutAbort({ status: "cart-empty" });

      const items = await transaction
        .select({
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          price: products.price,
        })
        .from(cartItems)
        .innerJoin(products, eq(products.id, cartItems.productId))
        .where(eq(cartItems.cartId, cart.id))
        .orderBy(asc(cartItems.id));

      if (items.length === 0) {
        throw new CheckoutAbort({ status: "cart-empty" });
      }

      const [address] = await transaction
        .select({ id: addresses.id })
        .from(addresses)
        .where(eq(addresses.userId, userId))
        .orderBy(desc(addresses.isDefault), asc(addresses.id))
        .limit(1);

      if (!address) {
        throw new CheckoutAbort({ status: "address-not-found" });
      }

      const total = calculateOrderTotal(items);
      const [order] = await transaction
        .insert(orders)
        .values({ userId, addressId: address.id, total })
        .returning({
          id: orders.id,
          status: orders.status,
          total: orders.total,
          createdAt: orders.createdAt,
        });

      if (!order) throw new Error("Order could not be created.");

      for (const item of items) {
        const [updatedProduct] = await transaction
          .update(products)
          .set({
            stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
          })
          .where(
            and(
              eq(products.id, item.productId),
              gte(products.stockQuantity, item.quantity),
            ),
          )
          .returning({ id: products.id });

        if (!updatedProduct) {
          throw new CheckoutAbort({
            status: "out-of-stock",
            productId: item.productId,
          });
        }
      }

      await transaction.insert(orderItems).values(
        items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      );

      await transaction.insert(inventoryMovements).values(
        items.map((item) => ({
          productId: item.productId,
          type: "outbound" as const,
          quantity: item.quantity,
          reason: `Order ${order.id}`,
        })),
      );

      await transaction.delete(cartItems).where(eq(cartItems.cartId, cart.id));

      return {
        status: "ok" as const,
        order: {
          id: order.id,
          status: order.status,
          total: order.total,
          currency: "BRL" as const,
          createdAt: order.createdAt.toISOString(),
        },
      };
    });
  } catch (error) {
    if (error instanceof CheckoutAbort) return error.result;
    throw new RepositoryError("checkout", "orders", error);
  }
};
