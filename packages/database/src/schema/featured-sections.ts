import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { featuredSectionType } from "./store-enums.ts";

export const featuredSections = pgTable(
  "featured_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull(),
    title: text("title").notNull(),
    type: featuredSectionType("type").notNull(),
    position: integer("position").notNull(),
    activeFrom: timestamp("active_from", { withTimezone: true }),
    activeTo: timestamp("active_to", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("featured_sections_slug_uidx").on(table.slug),
    index("featured_sections_position_idx").on(table.position),
    index("featured_sections_active_window_idx").on(
      table.activeFrom,
      table.activeTo,
    ),
    check(
      "featured_sections_position_non_negative",
      sql`${table.position} >= 0`,
    ),
    check(
      "featured_sections_active_window_valid",
      sql`${table.activeTo} IS NULL OR ${table.activeFrom} IS NULL OR ${table.activeTo} > ${table.activeFrom}`,
    ),
  ],
);

export type FeaturedSection = typeof featuredSections.$inferSelect;
export type NewFeaturedSection = typeof featuredSections.$inferInsert;
