import { t as Type, type Static } from "elysia";
import { createErrorResponseSchema } from "../../schemas/error.schemas.ts";
import {
  ProductEditionSchema,
  ProductFormatSchema,
  ProductCatalogItemSchema,
  ProductSchema,
} from "../../schemas/product-summary.schemas.ts";

export {
  InternalServerErrorResponseSchema,
  ValidationErrorResponseSchema,
} from "../../schemas/error.schemas.ts";

const BooleanQuerySchema = Type.BooleanString({
  description: "Boolean value provided in the query string.",
  examples: ["true"],
});

const MoneyQuerySchema = Type.Transform(
  Type.String({
    maxLength: 11,
    pattern: "^(?:0|[1-9]\\d*)(?:\\.\\d{1,2})?$",
    description: "Inclusive price normalized to two decimal places.",
    examples: ["80.00"],
  }),
)
  .Decode((value) => {
    const [integer, decimal = ""] = value.split(".");
    return `${integer}.${decimal.padEnd(2, "0")}`;
  })
  .Encode((value) => value);

export const ProductListQuerySchema = Type.Object(
  {
    page: Type.Optional(
      Type.Integer({
        minimum: 1,
        default: 1,
        description: "Requested page, starting at 1.",
        examples: ["1"],
      }),
    ),
    pageSize: Type.Optional(
      Type.Integer({
        minimum: 1,
        maximum: 100,
        default: 20,
        description: "Number of products per page, from 1 to 100.",
        examples: ["20"],
      }),
    ),
    search: Type.Optional(
      Type.String({
        minLength: 1,
        maxLength: 100,
        description: "Search by album, artist, or SKU.",
        examples: ["Sufjan Stevens"],
      }),
    ),
    format: Type.Optional(ProductFormatSchema),
    edition: Type.Optional(ProductEditionSchema),
    artist: Type.Optional(
      Type.String({
        minLength: 1,
        maxLength: 255,
        description: "Exact artist slug.",
        examples: ["sufjan-stevens"],
      }),
    ),
    genre: Type.Optional(
      Type.String({
        minLength: 1,
        maxLength: 100,
        description: "Album genre, case-insensitive.",
        examples: ["MPB"],
      }),
    ),
    category: Type.Optional(
      Type.String({
        minLength: 1,
        maxLength: 255,
        description: "Slug of a category associated with the product.",
        examples: ["indie"],
      }),
    ),
    tag: Type.Optional(
      Type.String({
        minLength: 1,
        maxLength: 100,
        description: "Exact product tag, case-insensitive.",
        examples: ["melancholic"],
      }),
    ),
    section: Type.Optional(
      Type.String({
        minLength: 1,
        maxLength: 100,
        description:
          "ID of an active curated section, such as home_releases or home_recommendations.",
        examples: ["home_releases"],
      }),
    ),
    collection: Type.Optional(
      Type.Union(
        [
          Type.Literal("bestsellers"),
          Type.Literal("new"),
          Type.Literal("promotions"),
          Type.Literal("imported"),
          Type.Literal("national"),
          Type.Literal("releases"),
          Type.Literal("recommendations"),
        ],
        {
          description: "Shortcut for collections displayed on the home screen.",
          examples: ["bestsellers"],
        },
      ),
    ),
    minPrice: Type.Optional(MoneyQuerySchema),
    maxPrice: Type.Optional(MoneyQuerySchema),
    inStock: Type.Optional(BooleanQuerySchema),
    isImported: Type.Optional(BooleanQuerySchema),
    onSale: Type.Optional(BooleanQuerySchema),
    sort: Type.Optional(
      Type.Union(
        [
          Type.Literal("newest"),
          Type.Literal("price_asc"),
          Type.Literal("price_desc"),
          Type.Literal("title_asc"),
          Type.Literal("best_selling"),
        ],
        {
          default: "newest",
          description: "Product listing sort order.",
          examples: ["newest"],
        },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: "Filters and pagination for the public product listing.",
  },
);

export type ProductListQuery = Static<typeof ProductListQuerySchema>;

export const ProductParamsSchema = Type.Object(
  {
    id: Type.String({
      minLength: 1,
      maxLength: 255,
      description: "Product identifier.",
      examples: ["w1"],
    }),
  },
  { additionalProperties: false },
);

export const PaginationSchema = Type.Object({
  page: Type.Integer({ minimum: 1 }),
  pageSize: Type.Integer({ minimum: 1, maximum: 100 }),
  totalItems: Type.Integer({ minimum: 0 }),
  totalPages: Type.Integer({ minimum: 0 }),
});

export const ProductListResponseSchema = Type.Object(
  {
    data: Type.Array(ProductCatalogItemSchema),
    pagination: PaginationSchema,
  },
  {
    description: "A paginated product list was returned successfully.",
  },
);

export const ProductDetailResponseSchema = Type.Object(
  {
    data: ProductSchema,
  },
  {
    description: "The requested product was returned successfully.",
  },
);

export const BadRequestResponseSchema = createErrorResponseSchema(
  "The request contains conflicting filters or an invalid price range.",
);

export const NotFoundResponseSchema = createErrorResponseSchema(
  "No product was found for the provided identifier.",
);
