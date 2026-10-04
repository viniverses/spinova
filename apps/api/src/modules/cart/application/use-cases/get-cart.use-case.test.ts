import { describe, expect, it, vi } from "vitest";
import type { CartReadModel, CartReader } from "../ports/cart-reader.interface.ts";
import { Money } from "../../../../shared/value-objects/money.ts";
import { GetCartUseCase } from "./get-cart.use-case.ts";

describe("GetCartUseCase", () => {
  it("calculates a quote in the application without an HTTP presenter", async () => {
    const cart: CartReadModel = { id: "cart-1", items: [{
      id: "item-1", quantity: 2, product: {
        id: "prod-1", albumId: "album-1", title: "Album",
        artist: { id: "artist-1", name: "Artist", slug: "artist" },
        sku: "SKU", format: "vinyl", edition: "standard",
        price: "12.35", compareAtPrice: null, currency: "BRL",
        stockQuantity: 5, inStock: true, isImported: false,
        genre: null, releaseDate: null, image: null,
      },
    }] };
    const reader: CartReader = { getCartByUserId: vi.fn().mockResolvedValue(cart) };
    const quote = { subtotal: Money.fromDecimal("24.70"), shipping: Money.fromDecimal("15.00"), total: Money.fromDecimal("39.70"), currency: "BRL" as const };
    const pricing = { calculateQuote: vi.fn().mockReturnValue(quote) };
    const result = await new GetCartUseCase(reader, pricing).execute({ userId: "user-1" });
    expect(result).toEqual({ cart, quote, totalQuantity: 2 });
    expect(reader.getCartByUserId).toHaveBeenCalledWith("user-1");
    expect(pricing.calculateQuote).toHaveBeenCalledExactlyOnceWith([{ price: Money.fromDecimal("12.35"), quantity: 2 }]);
  });

  it("prices the empty cart through the same policy", async () => {
    const reader: CartReader = { getCartByUserId: vi.fn().mockResolvedValue({ id: null, items: [] }) };
    const pricing = { calculateQuote: vi.fn().mockReturnValue({
      subtotal: Money.zero(), shipping: Money.zero(), total: Money.zero(), currency: "BRL",
    }) };
    const result = await new GetCartUseCase(reader, pricing).execute({ userId: "user-1" });
    expect(result.totalQuantity).toBe(0);
    expect(result.cart).toEqual({ id: null, items: [] });
    expect(pricing.calculateQuote).toHaveBeenCalledExactlyOnceWith([]);
  });
});
