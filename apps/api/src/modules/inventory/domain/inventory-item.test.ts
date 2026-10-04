import { describe, expect, it } from "vitest";
import { assertInventoryItems, InvalidInventoryReservationError } from "./inventory-item.ts";

describe("Inventory reservation input", () => {
  it("accepts distinct products with positive whole quantities", () => {
    expect(() => assertInventoryItems([{ productId: "p1", quantity: 1 }, { productId: "p2", quantity: 5 }])).not.toThrow();
  });

  it("rejects values that would corrupt a stock update", () => {
    for (const items of [
      [{ productId: "p1", quantity: 0 }],
      [{ productId: "p1", quantity: -1 }],
      [{ productId: "p1", quantity: 1.5 }],
      [{ productId: "", quantity: 1 }],
      [{ productId: "p1", quantity: 1 }, { productId: "p1", quantity: 2 }],
    ]) {
      expect(() => assertInventoryItems(items)).toThrow(InvalidInventoryReservationError);
    }
  });
});
