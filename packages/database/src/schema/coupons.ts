import { sql } from "drizzle-orm";
import {
  check,
  integer,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { discountType } from "./store-enums.ts";

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 50 }).notNull(),
    discountType: discountType("discount_type").notNull(),
    discountValue: numeric("discount_value", {
      precision: 10,
      scale: 2,
    }).notNull(),
    validFrom: timestamp("valid_from", { withTimezone: true })
      .defaultNow()
      .notNull(),
    validTo: timestamp("valid_to", { withTimezone: true }),
    usageLimit: integer("usage_limit"),
    timesUsed: integer("times_used").default(0).notNull(),
  },
  (table) => [
    uniqueIndex("coupons_code_uidx").on(table.code),
    check("coupons_code_uppercase", sql`${table.code} = upper(${table.code})`),
    check("coupons_discount_value_positive", sql`${table.discountValue} > 0`),
    check(
      "coupons_percentage_at_most_100",
      sql`${table.discountType} <> 'percentage' OR ${table.discountValue} <= 100`,
    ),
    check(
      "coupons_valid_window",
      sql`${table.validTo} IS NULL OR ${table.validTo} > ${table.validFrom}`,
    ),
    check(
      "coupons_usage_limit_positive",
      sql`${table.usageLimit} IS NULL OR ${table.usageLimit} > 0`,
    ),
    check("coupons_times_used_non_negative", sql`${table.timesUsed} >= 0`),
    check(
      "coupons_usage_within_limit",
      sql`${table.usageLimit} IS NULL OR ${table.timesUsed} <= ${table.usageLimit}`,
    ),
  ],
);

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
