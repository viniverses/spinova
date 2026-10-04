import type { InventoryItem } from "../../domain/inventory-item.ts";
export type { InventoryItem } from "../../domain/inventory-item.ts";

export interface InventoryReservation {
  reserveStock(items: readonly InventoryItem[]): Promise<string | null>;
  recordInventoryMovements(orderId: string, items: readonly InventoryItem[]): Promise<void>;
}
