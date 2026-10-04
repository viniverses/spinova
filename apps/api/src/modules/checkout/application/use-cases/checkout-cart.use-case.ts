import type { PricingCalculator } from "../../../../shared/contracts/pricing.ts";
import { Money } from "../../../../shared/value-objects/money.ts";
import {
  CartEmptyError,
  DeliveryAddressRequiredError,
  InsufficientStockError,
} from "../../domain/checkout.errors.ts";
import type {
  CheckoutTransaction,
  CompletedOrderResult,
} from "../ports/checkout-transaction.ts";

export interface CheckoutCartInput {
  userId: string;
}

export interface CheckoutCart {
  execute(input: CheckoutCartInput): Promise<CompletedOrderResult>;
}

export class CheckoutCartUseCase implements CheckoutCart {
  constructor(
    private readonly checkoutTransaction: CheckoutTransaction,
    private readonly pricingCalculator: PricingCalculator,
  ) {}

  public async execute(
    input: CheckoutCartInput,
  ): Promise<CompletedOrderResult> {
    return this.checkoutTransaction.execute(async (context) => {
      const cart = await context.getCartForUpdate(input.userId);
      if (!cart || cart.items.length === 0) {
        throw new CartEmptyError();
      }

      const address = await context.getDeliveryAddress(input.userId);
      if (!address) {
        throw new DeliveryAddressRequiredError();
      }

      const quote = this.pricingCalculator.calculateQuote(
        cart.items.map((item) => ({
          price: Money.fromDecimal(item.unitPrice),
          quantity: item.quantity,
        })),
      );

      const unavailableProductId = await context.reserveStock(cart.items);
      if (unavailableProductId) {
        throw new InsufficientStockError(unavailableProductId);
      }

      const order = await context.createOrder({
        userId: input.userId,
        total: quote.total.toDecimal(),
        address,
        items: cart.items,
      });

      await context.recordInventoryMovements(order.id, cart.items);
      await context.clearCart(cart.id);

      return {
        ...order,
        currency: quote.currency,
      };
    });
  }
}
