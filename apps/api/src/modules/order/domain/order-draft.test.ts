import { describe, expect, it } from "vitest";
import { assertOrderDraft, type OrderDraftProps } from "./order-draft.ts";
import { InvalidOrderError, InvalidOrderItemError } from "./order.errors.ts";

const order: OrderDraftProps = {
  userId: "user-1", total: "30.00",
  address: { id: "address-1", label: "Home", street: "Street", number: "1", complement: null,
    neighborhood: null, city: "City", state: "SP", zipCode: "01000-000", country: "BR" },
  items: [{ productId: "product-1", quantity: 1, unitPrice: "15.00",
    product: { id: "product-1", title: "Album", artist: { name: "Artist" }, format: "vinyl", image: null } }],
};

describe("Order draft", () => {
  it("accepts an order whose total includes shipping", () => {
    expect(() => assertOrderDraft(order)).not.toThrow();
  });

  it("rejects empty orders and mismatched or duplicate product snapshots", () => {
    expect(() => assertOrderDraft({ ...order, items: [] })).toThrow(InvalidOrderError);
    expect(() => assertOrderDraft({ ...order, items: [{ ...order.items[0]!, productId: "other" }] })).toThrow(InvalidOrderItemError);
    expect(() => assertOrderDraft({ ...order, items: [order.items[0]!, order.items[0]!] })).toThrow(InvalidOrderItemError);
  });

  it("rejects invalid monetary and quantity data before persistence", () => {
    expect(() => assertOrderDraft({ ...order, total: "-1.00" })).toThrow(InvalidOrderError);
    expect(() => assertOrderDraft({ ...order, items: [{ ...order.items[0]!, quantity: 0 }] })).toThrow(InvalidOrderItemError);
    expect(() => assertOrderDraft({ ...order, items: [{ ...order.items[0]!, unitPrice: "-1.00" }] })).toThrow(InvalidOrderItemError);
  });
});
