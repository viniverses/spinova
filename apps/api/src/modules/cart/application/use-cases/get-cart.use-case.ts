import type { PricingCalculator } from "../../../../shared/contracts/pricing.ts";
import { Money } from "../../../../shared/value-objects/money.ts";
import type { QuotedCart } from "../cart-quote.ts";
import type { CartReader } from "../ports/cart-reader.interface.ts";

export type GetCartInput = {
  userId: string;
};

export class GetCartUseCase {
  constructor(
    private readonly cartReader: CartReader,
    private readonly pricingCalculator: PricingCalculator,
  ) {}

  async execute(input: GetCartInput): Promise<QuotedCart> {
    const cart = await this.cartReader.getCartByUserId(input.userId);
    const quote = this.pricingCalculator.calculateQuote(
      cart.items.map((item) => ({
        price: Money.fromDecimal(item.product.price),
        quantity: item.quantity,
      })),
    );
    return {
      cart,
      quote,
      totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}
