import { t as Type, type Static } from "elysia";

import { MoneySchema } from "../../../../http/schemas/money.schemas.ts";
import { ProductCatalogItemSchema } from "../../../../http/schemas/product-summary.schemas.ts";
import { MAX_CART_ITEM_QUANTITY } from "../../domain/entities/cart-item.entity.ts";

export {
  ConflictResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
  ValidationErrorResponseSchema,
} from "../../../../http/schemas/error.schemas.ts";

export const CartItemSchema = Type.Object({
  id: Type.String(),
  quantity: Type.Integer({ minimum: 1, maximum: MAX_CART_ITEM_QUANTITY }),
  product: ProductCatalogItemSchema,
});

export const CartSchema = Type.Object({
  id: Type.Nullable(Type.String()),
  items: Type.Array(CartItemSchema),
  subtotal: MoneySchema,
  shipping: MoneySchema,
  total: MoneySchema,
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
    quantity: Type.Integer({ minimum: 0, maximum: MAX_CART_ITEM_QUANTITY }),
  },
  { additionalProperties: false },
);

export type CartItemDto = Static<typeof CartItemSchema>;
export type CartDto = Static<typeof CartSchema>;
export type CartProductDto = CartItemDto["product"];
export type CartItemParams = Static<typeof CartItemParamsSchema>;
export type UpdateCartItemBody = Static<typeof UpdateCartItemBodySchema>;
