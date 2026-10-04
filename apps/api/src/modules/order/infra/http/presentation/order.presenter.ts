import type { OrderDetailDto } from "../order.schemas.ts";
import type { Order } from "../../../domain/entities/order.entity.ts";

export const OrderPresenter = {
  toDetail(order: Order): OrderDetailDto {
    if (!order.address) {
      throw new Error("Order address is required to render order details.");
    }

    return {
      id: order.id,
      status: order.status,
      total: order.total.toDecimal(),
      currency: order.currency,
      createdAt: order.createdAt.toISOString(),
      itemsCount: order.itemsCount,
      items: order.items.map((item) => {
        if (!item.product) {
          throw new Error("Order item product is required to render details.");
        }

        return {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toDecimal(),
          product: item.product,
        };
      }),
      address: order.address,
    };
  },
};
