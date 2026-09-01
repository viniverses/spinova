import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "./user.ts";

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 50 }).notNull(),
    street: text("street").notNull(),
    number: varchar("number", { length: 30 }).notNull(),
    complement: text("complement"),
    city: text("city").notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    zipCode: varchar("zip_code", { length: 20 }).notNull(),
    country: varchar("country", { length: 2 }).default("BR").notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
  },
  (table) => [
    index("addresses_user_id_idx").on(table.userId),
    uniqueIndex("addresses_one_default_per_user_uidx")
      .on(table.userId)
      .where(sql`${table.isDefault} = true`),
  ],
);

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
