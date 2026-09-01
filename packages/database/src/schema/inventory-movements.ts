import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { products } from "./products.ts";
import { inventoryMovementType } from "./store-enums.ts";

export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    type: inventoryMovementType("type").notNull(),
    quantity: integer("quantity").notNull(),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("inventory_movements_product_created_at_idx").on(
      table.productId,
      table.createdAt,
    ),
    check(
      "inventory_movements_quantity_valid",
      sql`(${table.type} = 'adjustment' AND ${table.quantity} <> 0) OR (${table.type} <> 'adjustment' AND ${table.quantity} > 0)`,
    ),
  ],
);

export type InventoryMovement = typeof inventoryMovements.$inferSelect;
export type NewInventoryMovement = typeof inventoryMovements.$inferInsert;
