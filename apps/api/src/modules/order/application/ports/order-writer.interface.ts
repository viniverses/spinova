import type { OrderAddressSnapshot, OrderProductSnapshot } from "../../../../shared/contracts/order-snapshot.ts";
import type { OrderStatus } from "../../domain/entities/order.entity.ts";

export interface OrderDraftItem {
  productId: string;
  quantity: number;
  unitPrice: string;
  product: OrderProductSnapshot;
}

export interface CreateCheckoutOrderInput {
  userId: string;
  total: string;
  address: OrderAddressSnapshot;
  items: readonly OrderDraftItem[];
}

export interface PersistedCheckoutOrder {
  id: string;
  status: OrderStatus;
  total: string;
  createdAt: Date;
}

export interface OrderWriter {
  createOrder(input: CreateCheckoutOrderInput): Promise<PersistedCheckoutOrder>;
}
