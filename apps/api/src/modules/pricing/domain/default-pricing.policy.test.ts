import { describe, expect, it } from "vitest";

import { Money } from "../../../shared/value-objects/money.ts";
import { DefaultPricingPolicy } from "./default-pricing.policy.ts";

describe("DefaultPricingPolicy", () => {
  it("calculates a complete quote with shipping included", () => {
    const policy = new DefaultPricingPolicy();

    const quote = policy.calculateQuote([
      { price: Money.fromDecimal("100.00"), quantity: 1 },
      { price: Money.fromDecimal("50.00"), quantity: 2 },
    ]);

    expect(quote.subtotal.toDecimal()).toBe("200.00");
    expect(quote.shipping.toDecimal()).toBe("15.00");
    expect(quote.total.toDecimal()).toBe("215.00");
    expect(quote.currency).toBe("BRL");
  });

  it("does not charge shipping for an empty cart", () => {
    const policy = new DefaultPricingPolicy();
    const quote = policy.calculateQuote([]);

    expect(quote.subtotal.toDecimal()).toBe("0.00");
    expect(quote.shipping.toDecimal()).toBe("0.00");
    expect(quote.total.toDecimal()).toBe("0.00");
    expect(quote.currency).toBe("BRL");
  });
});
