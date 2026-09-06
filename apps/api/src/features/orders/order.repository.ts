import { RepositoryError } from "../../errors/index.ts";
import {
  addresses,
  albums,
  artists,
  cartItems,
  carts,
  db,
  inventoryMovements,
  orderItems,
  orders,
  productImages,
  products,
} from "@spinova/database";
import { and, asc, count, desc, eq, gte, inArray, sql } from "@spinova/database/query";

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

const primaryProductImage = db
  .select({
    productId: productImages.productId,
    url: productImages.url,
    altText: productImages.altText,
  })
  .from(productImages)
  .where(eq(productImages.position, 0))
  .as("order_item_primary_image");

export const listOrders = async (
  userId: string,
  page = 1,
  pageSize = 20,
) => {
  try {
    const offset = (page - 1) * pageSize;

    const [countRows, orderRows] = await Promise.all([
      db
        .select({ total: count() })
        .from(orders)
        .where(eq(orders.userId, userId)),
      db
        .select({
          id: orders.id,
          status: orders.status,
          total: orders.total,
          createdAt: orders.createdAt,
          address: {
            id: addresses.id,
            label: addresses.label,
            street: addresses.street,
            number: addresses.number,
            complement: addresses.complement,
            neighborhood: addresses.neighborhood,
            city: addresses.city,
            state: addresses.state,
            zipCode: addresses.zipCode,
            country: addresses.country,
          },
        })
        .from(orders)
        .innerJoin(addresses, eq(addresses.id, orders.addressId))
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt))
        .limit(pageSize)
        .offset(offset),
    ]);

    const totalItems = Number(countRows[0]?.total ?? 0);
    const totalPages = Math.ceil(totalItems / pageSize);

    if (orderRows.length === 0) {
      return {
        data: [],
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
        },
      };
    }

    const orderIds = orderRows.map((o) => o.id);

    const itemRows = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        productTitle: albums.title,
        productFormat: products.format,
        artistName: artists.name,
        imageUrl: primaryProductImage.url,
        imageAltText: primaryProductImage.altText,
      })
      .from(orderItems)
      .innerJoin(products, eq(products.id, orderItems.productId))
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(
        primaryProductImage,
        eq(primaryProductImage.productId, products.id),
      )
      .where(inArray(orderItems.orderId, orderIds))
      .orderBy(asc(orderItems.id));

    const itemsByOrderId = new Map<string, typeof itemRows>();
    for (const item of itemRows) {
      const existing = itemsByOrderId.get(item.orderId) ?? [];
      existing.push(item);
      itemsByOrderId.set(item.orderId, existing);
    }

    const data = orderRows.map((order) => {
      const items = (itemsByOrderId.get(order.id) ?? []).map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        product: {
          id: item.productId,
          title: item.productTitle,
          artist: {
            name: item.artistName,
          },
          format: item.productFormat,
          image: item.imageUrl
            ? { url: item.imageUrl, altText: item.imageAltText }
            : null,
        },
      }));

      const itemsCount = items.reduce((acc, it) => acc + it.quantity, 0);

      return {
        id: order.id,
        status: order.status,
        total: order.total,
        currency: "BRL" as const,
        createdAt: order.createdAt.toISOString(),
        itemsCount,
        items,
        address: order.address,
      };
    });

    return {
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    };
  } catch (error) {
    throw new RepositoryError("list", "orders", error);
  }
};

export const findOrderById = async (userId: string, orderId: string) => {
  try {
    const [order] = await db
      .select({
        id: orders.id,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
        address: {
          id: addresses.id,
          label: addresses.label,
          street: addresses.street,
          number: addresses.number,
          complement: addresses.complement,
          neighborhood: addresses.neighborhood,
          city: addresses.city,
          state: addresses.state,
          zipCode: addresses.zipCode,
          country: addresses.country,
        },
      })
      .from(orders)
      .innerJoin(addresses, eq(addresses.id, orders.addressId))
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
      .limit(1);

    if (!order) return null;

    const itemRows = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        productTitle: albums.title,
        productFormat: products.format,
        artistName: artists.name,
        imageUrl: primaryProductImage.url,
        imageAltText: primaryProductImage.altText,
      })
      .from(orderItems)
      .innerJoin(products, eq(products.id, orderItems.productId))
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(
        primaryProductImage,
        eq(primaryProductImage.productId, products.id),
      )
      .where(eq(orderItems.orderId, orderId))
      .orderBy(asc(orderItems.id));

    const items = itemRows.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      product: {
        id: item.productId,
        title: item.productTitle,
        artist: {
          name: item.artistName,
        },
        format: item.productFormat,
        image: item.imageUrl
          ? { url: item.imageUrl, altText: item.imageAltText }
          : null,
      },
    }));

    const itemsCount = items.reduce((acc, it) => acc + it.quantity, 0);

    return {
      data: {
        id: order.id,
        status: order.status,
        total: order.total,
        currency: "BRL" as const,
        createdAt: order.createdAt.toISOString(),
        itemsCount,
        items,
        address: order.address,
      },
    };
  } catch (error) {
    throw new RepositoryError("find", "orders", error);
  }
};
