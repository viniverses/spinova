import type { OrderProductSnapshot } from "../../../../shared/contracts/order-snapshot.ts";

export interface CheckoutCartItemSnapshot {
  productId: string;
  quantity: number;
  unitPrice: string;
  product: OrderProductSnapshot;
}

export interface CheckoutCartSnapshot {
  id: string;
  items: readonly CheckoutCartItemSnapshot[];
}

export interface CartCheckoutStore {
  getCartForUpdate(userId: string): Promise<CheckoutCartSnapshot | null>;
  clearCart(cartId: string): Promise<void>;
}
