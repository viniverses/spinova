import { sql } from "drizzle-orm";
import { date, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { artists } from "./artists.ts";

export const albums = pgTable(
  "albums",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "restrict" }),
    releaseDate: date("release_date"),
    genre: text("genre"),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("albums_artist_id_idx").on(table.artistId),
    index("albums_title_idx").on(table.title),
    index("albums_title_trgm_idx").using("gin", table.title.op("gin_trgm_ops")),
    index("albums_genre_idx").on(table.genre),
    index("albums_genre_lower_idx").on(sql`lower(${table.genre})`),
  ],
);

export type Album = typeof albums.$inferSelect;
export type NewAlbum = typeof albums.$inferInsert;
