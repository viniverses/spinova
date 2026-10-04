import type { CompletedOrderDto } from "../checkout.schemas.ts";
import type { CompletedOrderResult } from "../../../application/ports/checkout-transaction.ts";

export const CheckoutPresenter = {
  toCompleted(order: CompletedOrderResult): CompletedOrderDto {
    return {
      id: order.id,
      status: order.status,
      total: order.total,
      currency: order.currency,
      createdAt: order.createdAt.toISOString(),
    };
  },
};
