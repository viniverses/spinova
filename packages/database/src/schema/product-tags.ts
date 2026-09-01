import { check, index, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { products } from "./products.ts";

export const productTags = pgTable(
  "product_tags",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.tag] }),
    index("product_tags_tag_idx").on(table.tag),
    check("product_tags_tag_not_blank", sql`length(trim(${table.tag})) > 0`),
  ],
);
