import { describe, expect, it } from "vitest";

import { Money } from "../../../../shared/value-objects/money.ts";
import { InvalidOrderError } from "../order.errors.ts";
import { Order } from "./order.entity.ts";
import { OrderItem } from "./order-item.entity.ts";

describe("Order entity", () => {
  it("creates valid order and calculates itemsCount correctly", () => {
    const item1 = new OrderItem({
      id: "item-1",
      orderId: "order-1",
      productId: "prod-1",
      quantity: 2,
      unitPrice: Money.fromDecimal("50.00"),
    });

    const item2 = new OrderItem({
      id: "item-2",
      orderId: "order-1",
      productId: "prod-2",
      quantity: 3,
      unitPrice: Money.fromDecimal("30.00"),
    });

    const order = new Order({
      id: "order-1",
      userId: "user-1",
      addressId: "addr-1",
      status: "pending",
      total: Money.fromDecimal("190.00"),
      items: [item1, item2],
    });

    expect(order.id).toBe("order-1");
    expect(order.userId).toBe("user-1");
    expect(order.status).toBe("pending");
    expect(order.total.toDecimal()).toBe("190.00");
    expect(order.itemsCount).toBe(5);
  });

  it("enforces invariants on construction", () => {
    expect(
      () =>
        new Order({
          id: "",
          userId: "user-1",
          addressId: "addr-1",
          status: "pending",
          total: Money.fromDecimal("100.00"),
        }),
    ).toThrow(InvalidOrderError);

    expect(
      () =>
        new Order({
          id: "order-1",
          userId: "",
          addressId: "addr-1",
          status: "pending",
          total: Money.fromDecimal("100.00"),
        }),
    ).toThrow(InvalidOrderError);

    expect(
      () =>
        new Order({
          id: "order-1",
          userId: "user-1",
          addressId: "addr-1",
          status: "pending",
          total: Money.fromDecimal("-5.00"),
        }),
    ).toThrow(InvalidOrderError);
  });

  it("keeps hydrated order data available to a presenter", () => {
    const order = new Order({
      id: "order-100",
      userId: "user-100",
      addressId: "addr-100",
      status: "delivered",
      total: Money.fromDecimal("250.00"),
      currency: "BRL",
      createdAt: new Date("2026-09-01T12:00:00.000Z"),
      items: [
        new OrderItem({
          id: "item-100",
          orderId: "order-100",
          productId: "prod-100",
          quantity: 2,
          unitPrice: Money.fromDecimal("125.00"),
          product: {
            id: "prod-100",
            title: "Abbey Road",
            artist: { name: "The Beatles" },
            format: "vinyl",
            image: {
              url: "https://example.com/abbey.jpg",
              altText: "Abbey Road Cover",
            },
          },
        }),
      ],
      address: {
        id: "addr-100",
        label: "Casa",
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 4B",
        neighborhood: "Jardins",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
        country: "BR",
      },
    });

    expect(order.id).toBe("order-100");
    expect(order.userId).toBe("user-100");
    expect(order.status).toBe("delivered");
    expect(order.total.toDecimal()).toBe("250.00");
    expect(order.itemsCount).toBe(2);

    expect(order.items).toHaveLength(1);
    expect(order.items[0]!.product).toEqual({
      id: "prod-100",
      title: "Abbey Road",
      artist: { name: "The Beatles" },
      format: "vinyl",
      image: {
        url: "https://example.com/abbey.jpg",
        altText: "Abbey Road Cover",
      },
    });
    expect(order.address?.label).toBe("Casa");
  });
});
