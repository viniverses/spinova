import type { CartCheckoutStore } from "../../../cart/index.ts";
import type { DeliveryAddressReader } from "../../../address/index.ts";
import type { InventoryReservation } from "../../../inventory/index.ts";
import type { OrderWriter, PersistedCheckoutOrder } from "../../../order/index.ts";

export type { CheckoutCartItemSnapshot, CheckoutCartSnapshot } from "../../../cart/index.ts";
export type { CreateCheckoutOrderInput, PersistedCheckoutOrder } from "../../../order/index.ts";
export type CheckoutOrderStatus = PersistedCheckoutOrder["status"];

export interface CompletedOrderResult extends PersistedCheckoutOrder {
  currency: "BRL";
}

export interface CheckoutTransactionContext extends CartCheckoutStore, DeliveryAddressReader, InventoryReservation, OrderWriter {}

export interface CheckoutTransaction {
  execute<Result>(operation: (context: CheckoutTransactionContext) => Promise<Result>): Promise<Result>;
}
