import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { coupons } from "./coupons.ts";
import { orders } from "./orders.ts";

export const orderCoupons = pgTable(
  "order_coupons",
  {
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    couponId: uuid("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "restrict" }),
  },
  (table) => [
    primaryKey({ columns: [table.orderId, table.couponId] }),
    index("order_coupons_coupon_id_idx").on(table.couponId),
  ],
);
