import { t as Type } from "elysia";
import { DateTimeStringSchema } from "../../schemas/common.schemas.ts";
import { createErrorResponseSchema } from "../../schemas/error.schemas.ts";
import { ProductSummarySchema } from "../../schemas/product-summary.schemas.ts";

export {
  InternalServerErrorResponseSchema,
  ValidationErrorResponseSchema,
} from "../../schemas/error.schemas.ts";

export const WishlistItemSchema = Type.Object({
  id: Type.String(),
  product: ProductSummarySchema,
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

export const UnauthorizedResponseSchema = createErrorResponseSchema(
  "Authentication required.",
);

export const NotFoundResponseSchema = createErrorResponseSchema(
  "Resource not found.",
);

export const ConflictResponseSchema = createErrorResponseSchema(
  "Product already in wishlist.",
);
