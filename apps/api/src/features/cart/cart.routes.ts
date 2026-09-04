import { ConflictError, NotFoundError } from "../../errors/index.ts";
import { betterAuthPlugin } from "../../plugins/better-auth.ts";
import { Elysia } from "elysia";

import {
  addCartItem,
  getCartByUserId,
  setCartItemQuantity,
} from "./cart.repository.ts";
import {
  CartItemParamsSchema,
  CartItemResponseSchema,
  CartResponseSchema,
  ConflictResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
  UpdateCartItemBodySchema,
  ValidationErrorResponseSchema,
} from "./cart.schemas.ts";

const resolveMutation = (
  result: Awaited<ReturnType<typeof addCartItem>>,
  productId: string,
) => {
  if (result.status === "product-not-found") {
    throw new NotFoundError({
      code: "PRODUCT_NOT_FOUND",
      message: "Product not found.",
      details: { productId },
    });
  }
  if (result.status === "out-of-stock") {
    throw new ConflictError({
      code: "INSUFFICIENT_STOCK",
      message: "The requested quantity is not available.",
      details: { productId },
    });
  }
  return { data: result.item };
};

export const cartRoutes = new Elysia({
  name: "cart-routes",
  normalize: "typebox",
})
  .use(betterAuthPlugin)
  .get(
    "/cart",
    async ({ user }) => ({ data: await getCartByUserId(user.id) }),
    {
      auth: true,
      response: {
        200: CartResponseSchema,
        401: UnauthorizedResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
      detail: {
        operationId: "getCart",
        summary: "Get cart",
        description: "Returns the authenticated user's persisted cart.",
        tags: ["Cart"],
      },
    },
  )
  .post(
    "/cart/items/:productId",
    async ({ user, params }) =>
      resolveMutation(
        await addCartItem(user.id, params.productId),
        params.productId,
      ),
    {
      auth: true,
      params: CartItemParamsSchema,
      response: {
        200: CartItemResponseSchema,
        401: UnauthorizedResponseSchema,
        404: NotFoundResponseSchema,
        409: ConflictResponseSchema,
        422: ValidationErrorResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
      detail: {
        operationId: "addCartItem",
        summary: "Add product to cart",
        description: "Adds one unit of a product to the persisted cart.",
        tags: ["Cart"],
      },
    },
  )
  .patch(
    "/cart/items/:productId",
    async ({ user, params, body }) => {
      const result = await setCartItemQuantity(
        user.id,
        params.productId,
        body.quantity,
      );

      if (result.status === "removed") {
        return { data: await getCartByUserId(user.id) };
      }
      if (
        result.status === "item-not-found" ||
        result.status === "product-not-found"
      ) {
        throw new NotFoundError({
          code: "CART_ITEM_NOT_FOUND",
          message: "Product not found in cart.",
          details: { productId: params.productId },
        });
      }
      if (result.status === "out-of-stock") {
        throw new ConflictError({
          code: "INSUFFICIENT_STOCK",
          message: "The requested quantity is not available.",
          details: { productId: params.productId },
        });
      }

      return { data: await getCartByUserId(user.id) };
    },
    {
      auth: true,
      params: CartItemParamsSchema,
      body: UpdateCartItemBodySchema,
      response: {
        200: CartResponseSchema,
        401: UnauthorizedResponseSchema,
        404: NotFoundResponseSchema,
        409: ConflictResponseSchema,
        422: ValidationErrorResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
      detail: {
        operationId: "updateCartItemQuantity",
        summary: "Update cart item quantity",
        description:
          "Sets a persisted cart item's quantity. Zero removes the item.",
        tags: ["Cart"],
      },
    },
  );
