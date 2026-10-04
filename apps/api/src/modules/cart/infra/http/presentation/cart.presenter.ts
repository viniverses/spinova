import type { CartDto } from "../cart.schemas.ts";
import type { QuotedCart } from "../../../application/cart-quote.ts";

export const CartPresenter = {
  toResponse({ cart, quote, totalQuantity }: QuotedCart): CartDto {
    return {
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product,
      })),
      subtotal: quote.subtotal.toDecimal(),
      shipping: quote.shipping.toDecimal(),
      total: quote.total.toDecimal(),
      totalQuantity,
      currency: quote.currency,
    };
  },
};
