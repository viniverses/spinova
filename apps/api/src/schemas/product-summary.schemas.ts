import { t as Type } from "elysia";

import { NullableStringSchema } from "./common.schemas.ts";
import { MoneySchema, NullableMoneySchema } from "./money.schemas.ts";

export const ArtistSummarySchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  slug: Type.String(),
});

export const ProductFormatSchema = Type.Union(
  [Type.Literal("vinyl"), Type.Literal("cd"), Type.Literal("cassette")],
  {
    description: "Physical product format.",
    examples: ["vinyl"],
  },
);

export const ProductEditionSchema = Type.Union(
  [Type.Literal("standard"), Type.Literal("deluxe"), Type.Literal("colored")],
  {
    description: "Commercial product edition.",
    examples: ["colored"],
  },
);

export const ProductSummarySchema = Type.Object({
  id: Type.String(),
  albumId: Type.String(),
  title: Type.String(),
  artist: ArtistSummarySchema,
  sku: Type.String(),
  format: ProductFormatSchema,
  edition: ProductEditionSchema,
  price: MoneySchema,
  compareAtPrice: NullableMoneySchema,
  currency: Type.Literal("BRL"),
  stockQuantity: Type.Integer({ minimum: 0 }),
  inStock: Type.Boolean(),
  isImported: Type.Boolean(),
  genre: NullableStringSchema,
  releaseDate: NullableStringSchema,
});
