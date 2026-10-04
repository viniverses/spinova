import {
  addresses,
  albums,
  artists,
  db,
  orderItems,
  orders,
  productImages,
  products,
} from "@spinova/database";
import { and, asc, count, desc, eq, inArray } from "@spinova/database/query";

import { primaryImageJoinCondition } from "../../../../database/read-models/product-catalog.read-model.ts";
import {
  Order,
  type OrderAddressData,
  type OrderStatus,
} from "../../domain/entities/order.entity.ts";
import {
  OrderItem,
  type OrderItemProductData,
} from "../../domain/entities/order-item.entity.ts";
import type {
  IOrderRepository,
  OrderPage,
} from "../../domain/repositories/index.ts";
import { Money } from "../../../../shared/value-objects/money.ts";

type OrderListRow = {
  id: string;
  userId: string;
  status: OrderStatus;
  total: string;
  createdAt: Date;
  address: OrderAddressData;
  addressSnapshot: unknown;
};

type OrderItemFields = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  productTitle: string;
  productFormat: OrderItemProductData["format"];
  artistName: string;
  imageUrl: string | null;
  imageAltText: string | null;
  productSnapshot: unknown;
};

type OrderItemListRow = OrderItemFields & { orderId: string };

const isProductSnapshot = (value: unknown): value is OrderItemProductData => {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<OrderItemProductData>;
  return (
    typeof snapshot.id === "string" &&
    typeof snapshot.title === "string" &&
    typeof snapshot.artist?.name === "string" &&
    (snapshot.format === "vinyl" ||
      snapshot.format === "cd" ||
      snapshot.format === "cassette")
  );
};

const isAddressSnapshot = (value: unknown): value is OrderAddressData => {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<OrderAddressData>;
  return (
    typeof snapshot.id === "string" &&
    typeof snapshot.label === "string" &&
    typeof snapshot.street === "string" &&
    typeof snapshot.number === "string" &&
    typeof snapshot.city === "string" &&
    typeof snapshot.state === "string" &&
    typeof snapshot.zipCode === "string" &&
    typeof snapshot.country === "string"
  );
};

const toOrderItem = (row: OrderItemFields, orderId: string): OrderItem => {
  const product = isProductSnapshot(row.productSnapshot)
    ? row.productSnapshot
    : {
        id: row.productId,
        title: row.productTitle,
        artist: { name: row.artistName },
        format: row.productFormat,
        image: row.imageUrl
          ? { url: row.imageUrl, altText: row.imageAltText }
          : null,
      };

  return new OrderItem({
    id: row.id,
    orderId,
    productId: row.productId,
    quantity: row.quantity,
    unitPrice: Money.fromDecimal(row.unitPrice),
    product,
  });
};

const toOrder = (row: OrderListRow, items: OrderItem[]): Order => {
  const address = isAddressSnapshot(row.addressSnapshot)
    ? row.addressSnapshot
    : row.address;

  return new Order({
    id: row.id,
    userId: row.userId,
    addressId: address.id,
    status: row.status,
    total: Money.fromDecimal(row.total),
    currency: "BRL",
    createdAt: row.createdAt,
    items,
    address,
  });
};

export class DrizzleOrderRepository implements IOrderRepository {
  public async listByUser(
    userId: string,
    page = 1,
    pageSize = 20,
  ): Promise<OrderPage> {
    const offset = (page - 1) * pageSize;

    const [countRows, orderRows] = await Promise.all([
      db
        .select({ total: count() })
        .from(orders)
        .where(eq(orders.userId, userId)),
      db
        .select({
          id: orders.id,
          userId: orders.userId,
          status: orders.status,
          total: orders.total,
          createdAt: orders.createdAt,
          addressSnapshot: orders.addressSnapshot,
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
        orders: [],
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
        },
      };
    }

    const orderIds = orderRows.map((o: OrderListRow) => o.id);

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
        imageUrl: productImages.url,
        imageAltText: productImages.altText,
        productSnapshot: orderItems.productSnapshot,
      })
      .from(orderItems)
      .innerJoin(products, eq(products.id, orderItems.productId))
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(productImages, primaryImageJoinCondition)
      .where(inArray(orderItems.orderId, orderIds))
      .orderBy(asc(orderItems.id));

    const itemsByOrderId = new Map<string, OrderItemListRow[]>();
    for (const item of itemRows) {
      const existing = itemsByOrderId.get(item.orderId) ?? [];
      existing.push(item as OrderItemListRow);
      itemsByOrderId.set(item.orderId, existing);
    }

    const orderEntities = orderRows.map((order: OrderListRow) =>
      toOrder(
        order,
        (itemsByOrderId.get(order.id) ?? []).map((item) =>
          toOrderItem(item, order.id),
        ),
      ),
    );

    return {
      orders: orderEntities,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  public async findById(
    userId: string,
    orderId: string,
  ): Promise<Order | null> {
    const [order] = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
        addressSnapshot: orders.addressSnapshot,
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
        imageUrl: productImages.url,
        imageAltText: productImages.altText,
        productSnapshot: orderItems.productSnapshot,
      })
      .from(orderItems)
      .innerJoin(products, eq(products.id, orderItems.productId))
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(productImages, primaryImageJoinCondition)
      .where(eq(orderItems.orderId, orderId))
      .orderBy(asc(orderItems.id));

    return toOrder(
      order as OrderListRow,
      itemRows.map((item) => toOrderItem(item, order.id)),
    );
  }
}
