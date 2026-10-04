import type {
  PricedItem,
  PricingCalculator,
  PricingQuote,
} from "../../../shared/contracts/pricing.ts";
import { Money } from "../../../shared/value-objects/money.ts";

const SHIPPING_IN_CENTS = 1500;

export class DefaultPricingPolicy implements PricingCalculator {
  public calculateQuote(items: readonly PricedItem[]): PricingQuote {
    const subtotal = items.reduce(
      (sum, item) => sum.add(item.price.multiply(item.quantity)),
      Money.zero(),
    );
    const shipping = Money.fromCents(items.length > 0 ? SHIPPING_IN_CENTS : 0);

    return {
      subtotal,
      shipping,
      total: subtotal.add(shipping),
      currency: subtotal.currency,
    };
  }
}
