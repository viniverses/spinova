import { t as Type, type Static } from "elysia";
import { DateTimeStringSchema } from "../../../../http/schemas/common.schemas.ts";
import { ProductCatalogItemSchema } from "../../../../http/schemas/product-summary.schemas.ts";

export {
  ConflictResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
  ValidationErrorResponseSchema,
} from "../../../../http/schemas/error.schemas.ts";

export const WishlistItemSchema = Type.Object({
  id: Type.String(),
  product: ProductCatalogItemSchema,
  createdAt: DateTimeStringSchema,
});

export const WishlistListResponseSchema = Type.Object(
  {
    data: Type.Array(WishlistItemSchema),
  },
  { description: "Wishlist returned successfully." },
);

export const WishlistParamsSchema = Type.Object(
  {
    productId: Type.String({
      format: "uuid",
      description: "Product UUID to add or remove from wishlist.",
    }),
  },
  { additionalProperties: false },
);

export const WishlistAddResponseSchema = Type.Object(
  {
    data: Type.Object({
      id: Type.String(),
      productId: Type.String(),
      createdAt: DateTimeStringSchema,
    }),
  },
  { description: "Product added to wishlist successfully." },
);

export const WishlistRemoveResponseSchema = Type.Object(
  {
    data: Type.Object({
      productId: Type.String(),
    }),
  },
  { description: "Product removed from wishlist successfully." },
);

export type WishlistItemDto = Static<typeof WishlistItemSchema>;
export type WishlistEntryDto = Static<typeof WishlistAddResponseSchema>["data"];
export type WishlistParams = Static<typeof WishlistParamsSchema>;
