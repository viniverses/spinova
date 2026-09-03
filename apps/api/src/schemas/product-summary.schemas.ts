import { t as Type } from "elysia";

import {
  DateTimeStringSchema,
  NullableStringSchema,
} from "./common.schemas.ts";
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

const ProductCoreSchema = Type.Object({
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

export const ProductImageSchema = Type.Object({
  url: Type.String({ format: "uri" }),
  altText: NullableStringSchema,
});

export const ProductGalleryImageSchema = Type.Composite([
  ProductImageSchema,
  Type.Object({
    position: Type.Integer({ minimum: 0 }),
  }),
]);

export const ProductRatingSchema = Type.Object({
  average: Type.Union([Type.Number({ minimum: 1, maximum: 5 }), Type.Null()]),
  count: Type.Integer({ minimum: 0 }),
});

export const ProductCategorySchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  slug: Type.String(),
  type: Type.Union([
    Type.Literal("genre"),
    Type.Literal("tag"),
    Type.Literal("curated"),
  ]),
});

/** Canonical product contract. Individual endpoints expose projections of it. */
export const ProductSchema = Type.Composite([
  ProductCoreSchema,
  Type.Object({
    image: Type.Union([ProductImageSchema, Type.Null()]),
    images: Type.Array(ProductGalleryImageSchema),
    description: NullableStringSchema,
    tags: Type.Array(Type.String()),
    categories: Type.Array(ProductCategorySchema),
    rating: ProductRatingSchema,
    unitsSold: Type.Integer({ minimum: 0 }),
    createdAt: DateTimeStringSchema,
  }),
]);

/** Stable content projection for every product collection. */
export const ProductCatalogItemSchema = Type.Pick(ProductSchema, [
  "id",
  "albumId",
  "title",
  "artist",
  "sku",
  "format",
  "edition",
  "price",
  "compareAtPrice",
  "currency",
  "stockQuantity",
  "inStock",
  "isImported",
  "genre",
  "releaseDate",
  "image",
]);
