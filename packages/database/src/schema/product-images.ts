import {
  check,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { products } from "./products.ts";

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    position: integer("position").notNull(),
    altText: text("alt_text"),
  },
  (table) => [
    uniqueIndex("product_images_product_position_uidx").on(
      table.productId,
      table.position,
    ),
    uniqueIndex("product_images_product_url_uidx").on(
      table.productId,
      table.url,
    ),
    index("product_images_product_id_idx").on(table.productId),
    check("product_images_position_non_negative", sql`${table.position} >= 0`),
  ],
);

export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
