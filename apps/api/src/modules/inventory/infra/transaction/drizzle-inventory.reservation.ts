import { inventoryMovements, products } from "@spinova/database";
import { and, eq, gte, sql } from "@spinova/database/query";
import { assertInventoryItems } from "../../domain/inventory-item.ts";
import type { InventoryItem, InventoryReservation } from "../../application/ports/inventory-reservation.interface.ts";
import type { DatabaseTransaction } from "../../../../database/transaction.ts";

export class DrizzleInventoryReservation implements InventoryReservation {
  constructor(private readonly tx: DatabaseTransaction) {}

  async reserveStock(
    items: readonly InventoryItem[],
  ): Promise<string | null> {
    assertInventoryItems(items);
    for (const item of items) {
      const [updatedProduct] = await this.tx
        .update(products)
        .set({
          stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
        })
        .where(
          and(
            eq(products.id, item.productId),
            gte(products.stockQuantity, item.quantity),
          ),
        )
        .returning({ id: products.id });

      if (!updatedProduct) return item.productId;
    }

    return null;
  }

  async recordInventoryMovements(
    orderId: string,
    items: readonly InventoryItem[],
  ): Promise<void> {
    assertInventoryItems(items);
    await this.tx.insert(inventoryMovements).values(
      items.map((item) => ({
        productId: item.productId,
        type: "outbound" as const,
        quantity: item.quantity,
        reason: `Order ${orderId}`,
      })),
    );
  }
}
