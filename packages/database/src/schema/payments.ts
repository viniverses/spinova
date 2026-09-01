import { sql } from "drizzle-orm";
import {
  check,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { orders } from "./orders.ts";
import { paymentMethod, paymentStatus } from "./store-enums.ts";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    method: paymentMethod("method").notNull(),
    status: paymentStatus("status").default("pending").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    transactionId: text("transaction_id"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (table) => [
    index("payments_order_id_idx").on(table.orderId),
    index("payments_status_idx").on(table.status),
    uniqueIndex("payments_transaction_id_uidx").on(table.transactionId),
    check("payments_amount_positive", sql`${table.amount} > 0`),
    check(
      "payments_paid_at_consistent",
      sql`(${table.status} IN ('paid', 'refunded') AND ${table.paidAt} IS NOT NULL) OR (${table.status} NOT IN ('paid', 'refunded') AND ${table.paidAt} IS NULL)`,
    ),
  ],
);

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
