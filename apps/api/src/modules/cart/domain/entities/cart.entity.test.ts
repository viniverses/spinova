import { describe, expect, it } from "vitest";

import type { CartProduct } from "../cart-product.ts";
import {
  CartItemNotFoundError,
  InsufficientStockError,
  InvalidCartError,
  InvalidCartQuantityError,
} from "../cart.errors.ts";
import { CartEntity, CartItemEntity } from "./index.ts";

const createMockProduct = (overrides?: Partial<CartProduct>): CartProduct => ({
  id: "prod-1", price: "150.00", ...overrides,
});

describe("CartEntity & CartItemEntity", () => {
  it("creates empty cart entity", () => {
    const empty = CartEntity.empty();
    expect(empty.id).toBeNull();
    expect(empty.items).toHaveLength(0);
    expect(empty.totalQuantity).toBe(0);
    expect(empty.subtotalInCents).toBe(0);
    expect(empty.subtotal).toBe("0.00");
    expect(empty.items).toEqual([]);
  });

  it("calculates subtotal and item count correctly with multiple items", () => {
    const prod1 = createMockProduct({ price: "129.90" });
    const prod2 = createMockProduct({ id: "prod-2", price: "50.05" });

    const item1 = new CartItemEntity("item-1", 2, prod1);
    const item2 = new CartItemEntity("item-2", 3, prod2);

    expect(item1.subtotalInCents).toBe(25980);
    expect(item2.subtotalInCents).toBe(15015);

    const cart = new CartEntity("cart-123", [item1, item2]);

    expect(cart.id).toBe("cart-123");
    expect(cart.totalQuantity).toBe(5);
    expect(cart.subtotalInCents).toBe(40995);
    expect(cart.subtotal).toBe("409.95");

    expect(cart.id).toBe("cart-123");
    expect(cart.totalQuantity).toBe(5);
    expect(cart.subtotal).toBe("409.95");
    expect(cart.items).toHaveLength(2);
    expect(cart.items[0]?.product.id).toBe("prod-1");
  });

  it("owns add, change, and remove operations", () => {
    const cart = CartEntity.empty();
    const product = createMockProduct();

    cart.addItem(product, 5);
    cart.addItem(product, 5);
    expect(cart.items[0]?.quantity).toBe(2);

    cart.changeQuantity(product.id, 4, 5);
    expect(cart.items[0]?.quantity).toBe(4);

    cart.removeItem(product.id);
    expect(cart.items).toHaveLength(0);
  });

  it("keeps quantity and identity invariants inside the aggregate", () => {
    const product = createMockProduct();

    expect(() => new CartItemEntity("item-1", 0, product)).toThrow(
      InvalidCartQuantityError,
    );
    expect(() => new CartEntity("cart-1", [
      new CartItemEntity("item-1", 1, product),
      new CartItemEntity("item-2", 1, product),
    ])).toThrow(InvalidCartError);

    const cart = new CartEntity("cart-1", [
      new CartItemEntity("item-1", 5, product),
    ]);
    expect(() => cart.changeQuantity(product.id, 100, 100)).toThrow(
      InvalidCartQuantityError,
    );
    expect(() => cart.addItem(product, 5)).toThrow(InsufficientStockError);
    expect(() => cart.removeItem("missing-product")).toThrow(
      CartItemNotFoundError,
    );
  });
});
