import { describe, expect, it } from "vitest";

import { Money } from "../../../../shared/value-objects/money.ts";
import { InvalidOrderItemError } from "../order.errors.ts";
import { OrderItem } from "./order-item.entity.ts";

describe("OrderItem entity", () => {
  it("creates item and calculates subtotal in cents correctly", () => {
    const item = new OrderItem({
      id: "item-1",
      orderId: "order-1",
      productId: "prod-1",
      quantity: 3,
      unitPrice: Money.fromDecimal("49.90"),
    });

    expect(item.id).toBe("item-1");
    expect(item.quantity).toBe(3);
    expect(item.unitPrice.toDecimal()).toBe("49.90");
    expect(item.subtotalInCents).toBe(14970);
  });

  it("enforces positive quantity and valid unit price", () => {
    expect(
      () =>
        new OrderItem({
          id: "item-1",
          orderId: "order-1",
          productId: "prod-1",
          quantity: 0,
          unitPrice: Money.fromDecimal("10.00"),
        }),
    ).toThrow(InvalidOrderItemError);

    expect(
      () =>
        new OrderItem({
          id: "item-1",
          orderId: "order-1",
          productId: "prod-1",
          quantity: 1,
          unitPrice: Money.fromDecimal("-10.00"),
        }),
    ).toThrow(InvalidOrderItemError);
  });
});
