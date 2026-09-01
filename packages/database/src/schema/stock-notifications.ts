import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { products } from "./products.ts";
import { user } from "./user.ts";

export const stockNotifications = pgTable(
  "stock_notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    notified: boolean("notified").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("stock_notifications_pending_user_product_uidx")
      .on(table.userId, table.productId)
      .where(sql`${table.notified} = false`),
    index("stock_notifications_product_notified_idx").on(
      table.productId,
      table.notified,
    ),
  ],
);

export type StockNotification = typeof stockNotifications.$inferSelect;
export type NewStockNotification = typeof stockNotifications.$inferInsert;
