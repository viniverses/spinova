CREATE EXTENSION IF NOT EXISTS "pg_trgm";--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "neighborhood" text;--> statement-breakpoint
CREATE INDEX "albums_title_idx" ON "albums" USING btree ("title");--> statement-breakpoint
CREATE INDEX "albums_title_trgm_idx" ON "albums" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "albums_genre_idx" ON "albums" USING btree ("genre");--> statement-breakpoint
CREATE INDEX "albums_genre_lower_idx" ON "albums" USING btree (lower("genre"));--> statement-breakpoint
CREATE INDEX "artists_name_idx" ON "artists" USING btree ("name");--> statement-breakpoint
CREATE INDEX "artists_name_trgm_idx" ON "artists" USING gin ("name" gin_trgm_ops);