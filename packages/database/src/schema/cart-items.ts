import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { carts } from "./carts.ts";
import { products } from "./products.ts";

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
  },
  (table) => [
    uniqueIndex("cart_items_cart_product_uidx").on(
      table.cartId,
      table.productId,
    ),
    index("cart_items_product_id_idx").on(table.productId),
    check("cart_items_quantity_positive", sql`${table.quantity} > 0`),
  ],
);

export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
