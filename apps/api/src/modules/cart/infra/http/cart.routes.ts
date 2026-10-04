import { betterAuthPlugin } from "../../../../http/plugins/better-auth.ts";
import { Elysia } from "elysia";

import { AddToCartUseCase } from "../../application/use-cases/add-to-cart.use-case.ts";
import { GetCartUseCase } from "../../application/use-cases/get-cart.use-case.ts";
import { UpdateCartQuantityUseCase } from "../../application/use-cases/update-cart-quantity.use-case.ts";
import type { ProductStockReader } from "../../application/ports/product-stock-reader.interface.ts";
import type { CartReader } from "../../application/ports/cart-reader.interface.ts";
import {
  CartItemParamsSchema,
  CartResponseSchema,
  ConflictResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
  UpdateCartItemBodySchema,
  ValidationErrorResponseSchema,
} from "./cart.schemas.ts";
import type { ICartRepository } from "../../domain/repositories/cart.repository.interface.ts";
import { CartPresenter } from "./presentation/cart.presenter.ts";
import type { PricingCalculator } from "../../../../shared/contracts/pricing.ts";
import { cartErrorMapper } from "./cart.error-mapper.ts";

export interface CartRoutesDependencies {
  cartRepository: ICartRepository;
  cartReader: CartReader;
  productStockReader: ProductStockReader;
  pricingCalculator: PricingCalculator;
}

export const createCartRoutes = (deps: CartRoutesDependencies) => {
  const getCartUseCase = new GetCartUseCase(deps.cartReader, deps.pricingCalculator);
  const addToCartUseCase = new AddToCartUseCase(
    deps.cartRepository,
    deps.productStockReader,
  );
  const updateCartQuantityUseCase = new UpdateCartQuantityUseCase(
    deps.cartRepository,
    deps.productStockReader,
  );

  return new Elysia({
    prefix: "/cart",
    name: "cart-routes",
    normalize: "typebox",
  })
    .use(betterAuthPlugin)
    .use(cartErrorMapper)
    .get(
      "/",
      async ({ user }) => {
        const cart = await getCartUseCase.execute({ userId: user.id });
        return { data: CartPresenter.toResponse(cart) };
      },
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
      "/items/:productId",
      async ({ user, params }) => {
        await addToCartUseCase.execute({
          userId: user.id,
          productId: params.productId,
        });
        const cart = await getCartUseCase.execute({ userId: user.id });
        return { data: CartPresenter.toResponse(cart) };
      },
      {
        auth: true,
        params: CartItemParamsSchema,
        response: {
          200: CartResponseSchema,
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
      "/items/:productId",
      async ({ user, params, body }) => {
        await updateCartQuantityUseCase.execute({
          userId: user.id,
          productId: params.productId,
          quantity: body.quantity,
        });
        const cart = await getCartUseCase.execute({ userId: user.id });
        return { data: CartPresenter.toResponse(cart) };
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
};
