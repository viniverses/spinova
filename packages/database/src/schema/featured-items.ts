import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { featuredSections } from "./featured-sections.ts";
import { products } from "./products.ts";

export const featuredItems = pgTable(
  "featured_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => featuredSections.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
  },
  (table) => [
    uniqueIndex("featured_items_section_product_uidx").on(
      table.sectionId,
      table.productId,
    ),
    uniqueIndex("featured_items_section_position_uidx").on(
      table.sectionId,
      table.position,
    ),
    index("featured_items_product_id_idx").on(table.productId),
    check("featured_items_position_non_negative", sql`${table.position} >= 0`),
  ],
);

export type FeaturedItem = typeof featuredItems.$inferSelect;
export type NewFeaturedItem = typeof featuredItems.$inferInsert;
