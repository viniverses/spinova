import { t as Type } from "elysia";

import { createErrorResponseSchema } from "../../schemas/error.schemas.ts";
import { MoneySchema } from "../../schemas/money.schemas.ts";
import { ProductCatalogItemSchema } from "../../schemas/product-summary.schemas.ts";

export {
  InternalServerErrorResponseSchema,
  ValidationErrorResponseSchema,
} from "../../schemas/error.schemas.ts";

export const CartItemSchema = Type.Object({
  id: Type.String(),
  quantity: Type.Integer({ minimum: 1 }),
  product: ProductCatalogItemSchema,
});

export const CartSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Null()]),
  items: Type.Array(CartItemSchema),
  subtotal: MoneySchema,
  totalQuantity: Type.Integer({ minimum: 0 }),
  currency: Type.Literal("BRL"),
});

export const CartResponseSchema = Type.Object({ data: CartSchema });

export const CartItemResponseSchema = Type.Object({ data: CartItemSchema });

export const CartItemParamsSchema = Type.Object(
  {
    productId: Type.String({
      format: "uuid",
      description: "Product UUID in the cart.",
    }),
  },
  { additionalProperties: false },
);

export const UpdateCartItemBodySchema = Type.Object(
  {
    quantity: Type.Integer({ minimum: 0, maximum: 99 }),
  },
  { additionalProperties: false },
);

export const UnauthorizedResponseSchema = createErrorResponseSchema(
  "Authentication required.",
);
export const NotFoundResponseSchema = createErrorResponseSchema(
  "Product or cart item not found.",
);
export const ConflictResponseSchema = createErrorResponseSchema(
  "The requested quantity is not available.",
);
