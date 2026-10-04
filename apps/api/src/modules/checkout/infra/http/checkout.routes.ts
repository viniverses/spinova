import { betterAuthPlugin } from "../../../../http/plugins/better-auth.ts";
import { Elysia } from "elysia";

import type { CheckoutCart } from "../../application/use-cases/checkout-cart.use-case.ts";
import {
  CheckoutBadRequestResponseSchema,
  CheckoutConflictResponseSchema,
  CompletedOrderResponseSchema,
  InternalServerErrorResponseSchema,
  UnauthorizedResponseSchema,
} from "./checkout.schemas.ts";
import { CheckoutPresenter } from "./presentation/checkout.presenter.ts";
import { checkoutErrorMapper } from "./checkout.error-mapper.ts";

export interface CheckoutRoutesDependencies {
  checkoutCart: CheckoutCart;
}

export const createCheckoutRoutes = (deps: CheckoutRoutesDependencies) => {
  return new Elysia({
    prefix: "/orders",
    name: "checkout-routes",
    normalize: "typebox",
  })
    .use(betterAuthPlugin)
    .use(checkoutErrorMapper)
    .post(
      "/",
      async ({ user, set }) => {
        const order = await deps.checkoutCart.execute({ userId: user.id });
        set.status = 201;
        return { data: CheckoutPresenter.toCompleted(order) };
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
};
