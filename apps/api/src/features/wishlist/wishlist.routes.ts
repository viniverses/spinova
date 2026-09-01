import { ConflictError, NotFoundError } from "../../errors/index.ts";
import { betterAuthPlugin } from "../../plugins/better-auth.ts";
import { Elysia } from "elysia";

import {
  addToWishlist,
  getWishlistByUserId,
  removeFromWishlist,
} from "./wishlist.repository.ts";
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

export const wishlistRoutes = new Elysia({
  name: "wishlist-routes",
  normalize: "typebox",
})
  .use(betterAuthPlugin)
  .get(
    "/wishlist",
    async ({ user }) => {
      const items = await getWishlistByUserId(user.id);
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
    "/wishlist/:productId",
    async ({ user, params }) => {
      const entry = await addToWishlist(user.id, params.productId);
      if (!entry) {
        throw new ConflictError({
          code: "WISHLIST_DUPLICATE",
          message: "Product is already in your wishlist.",
          details: { productId: params.productId },
        });
      }

      return {
        data: {
          id: entry.id,
          productId: entry.productId,
          createdAt: entry.createdAt.toISOString(),
        },
      };
    },
    {
      auth: true,
      params: WishlistParamsSchema,
      response: {
        200: WishlistAddResponseSchema,
        401: UnauthorizedResponseSchema,
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
    "/wishlist/:productId",
    async ({ user, params }) => {
      const removed = await removeFromWishlist(user.id, params.productId);
      if (!removed) {
        throw new NotFoundError({
          code: "WISHLIST_ENTRY_NOT_FOUND",
          message: "Product not found in your wishlist.",
          details: { productId: params.productId },
        });
      }

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
