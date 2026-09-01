import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { albums } from "./albums.ts";
import { productEdition, productFormat } from "./store-enums.ts";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "restrict" }),
    sku: varchar("sku", { length: 100 }).notNull(),
    format: productFormat("format").notNull(),
    edition: productEdition("edition").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: numeric("compare_at_price", {
      precision: 10,
      scale: 2,
    }),
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    isImported: boolean("is_imported").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("products_sku_uidx").on(table.sku),
    index("products_album_id_idx").on(table.albumId),
    index("products_stock_quantity_idx").on(table.stockQuantity),
    check("products_price_non_negative", sql`${table.price} >= 0`),
    check(
      "products_compare_at_price_valid",
      sql`${table.compareAtPrice} IS NULL OR ${table.compareAtPrice} > ${table.price}`,
    ),
    check(
      "products_stock_quantity_non_negative",
      sql`${table.stockQuantity} >= 0`,
    ),
  ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
