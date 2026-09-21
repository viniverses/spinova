import { pgEnum } from "drizzle-orm/pg-core";

export const featuredSectionType = pgEnum("featured_section_type", [
  "banner",
  "carousel",
]);
