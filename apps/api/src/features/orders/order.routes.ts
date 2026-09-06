import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../errors/index.ts";
import { betterAuthPlugin } from "../../plugins/better-auth.ts";
import { Elysia } from "elysia";

import {
  createOrderFromCart,
  findOrderById,
  listOrders,
} from "./order.repository.ts";
import {
  CheckoutBadRequestResponseSchema,
  CheckoutConflictResponseSchema,
  CompletedOrderResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  OrderDetailResponseSchema,
  OrderListQuerySchema,
  OrderListResponseSchema,
  OrderParamsSchema,
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
  )
  .get(
    "/orders",
    async ({ user, query }) => {
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 20;
      return await listOrders(user.id, page, pageSize);
    },
    {
      auth: true,
      query: OrderListQuerySchema,
      response: {
        200: OrderListResponseSchema,
        401: UnauthorizedResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
      detail: {
        operationId: "listOrders",
        summary: "List orders",
        description: "Returns paginated orders for the authenticated user.",
        tags: ["Orders"],
      },
    },
  )
  .get(
    "/orders/:id",
    async ({ user, params }) => {
      const result = await findOrderById(user.id, params.id);
      if (!result) {
        throw new NotFoundError({
          code: "ORDER_NOT_FOUND",
          message: "Order not found.",
          details: { orderId: params.id },
        });
      }
      return result;
    },
    {
      auth: true,
      params: OrderParamsSchema,
      response: {
        200: OrderDetailResponseSchema,
        401: UnauthorizedResponseSchema,
        404: NotFoundResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
      detail: {
        operationId: "getOrderById",
        summary: "Get order by ID",
        description: "Returns order details by ID for the authenticated user.",
        tags: ["Orders"],
      },
    },
  );
