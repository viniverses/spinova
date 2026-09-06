import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const artists = pgTable(
  "artists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    imageUrl: text("image_url"),
    bio: text("bio"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("artists_slug_uidx").on(table.slug),
    index("artists_name_idx").on(table.name),
    index("artists_name_trgm_idx").using("gin", table.name.op("gin_trgm_ops")),
  ],
);

export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;
