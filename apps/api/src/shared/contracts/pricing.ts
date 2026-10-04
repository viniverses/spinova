import type { Money } from "../value-objects/money.ts";

export interface PricedItem {
  price: Money;
  quantity: number;
}

export interface PricingQuote {
  subtotal: Money;
  shipping: Money;
  total: Money;
  currency: "BRL";
}

export interface PricingCalculator {
  calculateQuote(items: readonly PricedItem[]): PricingQuote;
}
