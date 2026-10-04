import { betterAuthPlugin } from "../../../../http/plugins/better-auth.ts";
import { Elysia } from "elysia";

import { AddToWishlistUseCase } from "../../application/use-cases/add-to-wishlist.use-case.ts";
import { GetWishlistUseCase } from "../../application/use-cases/get-wishlist.use-case.ts";
import { RemoveFromWishlistUseCase } from "../../application/use-cases/remove-from-wishlist.use-case.ts";
import type { IWishlistRepository } from "../../application/ports/wishlist.repository.interface.ts";
import { wishlistErrorMapper } from "./wishlist.error-mapper.ts";
import {
  ConflictResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
  ValidationErrorResponseSchema,
  WishlistAddResponseSchema,
  WishlistListResponseSchema,
  WishlistParamsSchema,
  WishlistRemoveResponseSchema,
} from "./wishlist.schemas.ts";

export interface WishlistRoutesDependencies {
  wishlistRepository: IWishlistRepository;
}

export const createWishlistRoutes = (deps: WishlistRoutesDependencies) => {
  const getWishlistUseCase = new GetWishlistUseCase(deps.wishlistRepository);
  const addToWishlistUseCase = new AddToWishlistUseCase(
    deps.wishlistRepository,
  );
  const removeFromWishlistUseCase = new RemoveFromWishlistUseCase(
    deps.wishlistRepository,
  );

  return new Elysia({
    prefix: "/wishlist",
    name: "wishlist-routes",
    normalize: "typebox",
  })
    .use(betterAuthPlugin)
    .use(wishlistErrorMapper)
    .get(
      "/",
      async ({ user }) => {
        const items = await getWishlistUseCase.execute({ userId: user.id });
        return { data: items };
      },
      {
        auth: true,
        response: {
          200: WishlistListResponseSchema,
          401: UnauthorizedResponseSchema,
          500: InternalServerErrorResponseSchema,
        },
        detail: {
          operationId: "getWishlist",
          summary: "Get wishlist",
          description:
            "Returns all products in the authenticated user's wishlist.",
          tags: ["Wishlist"],
        },
      },
    )
    .post(
      "/:productId",
      async ({ user, params }) => {
        const entry = await addToWishlistUseCase.execute({
          userId: user.id,
          productId: params.productId,
        });
        return { data: entry };
      },
      {
        auth: true,
        params: WishlistParamsSchema,
        response: {
          200: WishlistAddResponseSchema,
          401: UnauthorizedResponseSchema,
          404: NotFoundResponseSchema,
          409: ConflictResponseSchema,
          422: ValidationErrorResponseSchema,
          500: InternalServerErrorResponseSchema,
        },
        detail: {
          operationId: "addToWishlist",
          summary: "Add to wishlist",
          description: "Adds a product to the authenticated user's wishlist.",
          tags: ["Wishlist"],
        },
      },
    )
    .delete(
      "/:productId",
      async ({ user, params }) => {
        await removeFromWishlistUseCase.execute({
          userId: user.id,
          productId: params.productId,
        });
        return { data: { productId: params.productId } };
      },
      {
        auth: true,
        params: WishlistParamsSchema,
        response: {
          200: WishlistRemoveResponseSchema,
          401: UnauthorizedResponseSchema,
          404: NotFoundResponseSchema,
          422: ValidationErrorResponseSchema,
          500: InternalServerErrorResponseSchema,
        },
        detail: {
          operationId: "removeFromWishlist",
          summary: "Remove from wishlist",
          description:
            "Removes a product from the authenticated user's wishlist.",
          tags: ["Wishlist"],
        },
      },
    );
};
