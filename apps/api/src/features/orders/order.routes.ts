import { BadRequestError, ConflictError } from "../../errors/index.ts";
import { betterAuthPlugin } from "../../plugins/better-auth.ts";
import { Elysia } from "elysia";

import { createOrderFromCart } from "./order.repository.ts";
import {
  CheckoutBadRequestResponseSchema,
  CheckoutConflictResponseSchema,
  CompletedOrderResponseSchema,
  InternalServerErrorResponseSchema,
  UnauthorizedResponseSchema,
} from "./order.schemas.ts";

export const orderRoutes = new Elysia({
  name: "order-routes",
  normalize: "typebox",
})
  .use(betterAuthPlugin)
  .post(
    "/orders",
    async ({ user, set }) => {
      const result = await createOrderFromCart(user.id);

      if (result.status === "cart-empty") {
        throw new BadRequestError({
          code: "CART_EMPTY",
          message: "The cart has no items to checkout.",
        });
      }

      if (result.status === "address-not-found") {
        throw new BadRequestError({
          code: "DELIVERY_ADDRESS_REQUIRED",
          message: "A delivery address is required to checkout.",
        });
      }

      if (result.status === "out-of-stock") {
        throw new ConflictError({
          code: "INSUFFICIENT_STOCK",
          message: "One or more products no longer have sufficient stock.",
          details: { productId: result.productId },
        });
      }

      set.status = 201;
      return { data: result.order };
    },
    {
      auth: true,
      response: {
        201: CompletedOrderResponseSchema,
        400: CheckoutBadRequestResponseSchema,
        401: UnauthorizedResponseSchema,
        409: CheckoutConflictResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
      detail: {
        operationId: "createOrderFromCart",
        summary: "Checkout cart",
        description:
          "Creates an order from the authenticated user's cart and clears it atomically.",
        tags: ["Orders"],
      },
    },
  );
