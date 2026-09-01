import { pgTable, text, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { categoryType } from "./store-enums.ts";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    type: categoryType("type").notNull(),
  },
  (table) => [uniqueIndex("categories_slug_uidx").on(table.slug)],
);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
