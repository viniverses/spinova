import type { OrderAddressSnapshot } from "../../../../shared/contracts/order-snapshot.ts";

export interface DeliveryAddressReader {
  getDeliveryAddress(userId: string): Promise<OrderAddressSnapshot | null>;
}
