import { pgEnum } from "drizzle-orm/pg-core";

export const productFormat = pgEnum("product_format", [
  "vinyl",
  "cd",
  "cassette",
]);

export const productEdition = pgEnum("product_edition", [
  "standard",
  "deluxe",
  "colored",
]);

export const categoryType = pgEnum("category_type", [
  "genre",
  "tag",
  "curated",
]);
