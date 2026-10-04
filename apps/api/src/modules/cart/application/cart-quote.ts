import type { PricingQuote } from "../../../shared/contracts/pricing.ts";
import type { CartReadModel } from "./ports/cart-reader.interface.ts";

export interface QuotedCart {
  cart: CartReadModel;
  quote: PricingQuote;
  totalQuantity: number;
}
