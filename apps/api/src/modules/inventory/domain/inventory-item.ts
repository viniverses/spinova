import { DomainError } from "../../../shared/errors/domain.ts";

export interface InventoryItem {
  productId: string;
  quantity: number;
}

export class InvalidInventoryReservationError extends DomainError {
  readonly code = "INVALID_INVENTORY_RESERVATION";
  constructor() { super("Stock movements require unique product identities and positive integer quantities."); }
}

export const assertInventoryItems = (items: readonly InventoryItem[]): void => {
  const productIds = new Set<string>();
  for (const item of items) {
    if (!item.productId || productIds.has(item.productId) || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
      throw new InvalidInventoryReservationError();
    }
    productIds.add(item.productId);
  }
};
