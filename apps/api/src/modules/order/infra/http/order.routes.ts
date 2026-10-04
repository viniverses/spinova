import { betterAuthPlugin } from "../../../../http/plugins/better-auth.ts";
import { Elysia } from "elysia";

import { FindOrderByIdUseCase } from "../../application/use-cases/find-order-by-id.use-case.ts";
import { ListOrdersUseCase } from "../../application/use-cases/list-orders.use-case.ts";
import type { IOrderRepository } from "../../domain/repositories/order.repository.interface.ts";
import {
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  OrderDetailResponseSchema,
  OrderListQuerySchema,
  OrderListResponseSchema,
  OrderParamsSchema,
  UnauthorizedResponseSchema,
} from "./order.schemas.ts";
import { OrderPresenter } from "./presentation/order.presenter.ts";
import { orderErrorMapper } from "./order.error-mapper.ts";

export interface OrderRoutesDependencies {
  orderRepository: IOrderRepository;
}

export const createOrderRoutes = (deps: OrderRoutesDependencies) => {
  const listOrdersUseCase = new ListOrdersUseCase(deps.orderRepository);
  const findOrderByIdUseCase = new FindOrderByIdUseCase(deps.orderRepository);

  return new Elysia({
    prefix: "/orders",
    name: "order-routes",
    normalize: "typebox",
  })
    .use(betterAuthPlugin)
    .use(orderErrorMapper)
    .get(
      "/",
      async ({ user, query }) => {
        const result = await listOrdersUseCase.execute({
          userId: user.id,
          page: query.page,
          pageSize: query.pageSize,
        });
        return {
          data: result.orders.map(OrderPresenter.toDetail),
          pagination: result.pagination,
        };
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
      "/:id",
      async ({ user, params }) => {
        const order = await findOrderByIdUseCase.execute({
          userId: user.id,
          orderId: params.id,
        });
        return { data: OrderPresenter.toDetail(order) };
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
          description:
            "Returns order details by ID for the authenticated user.",
          tags: ["Orders"],
        },
      },
    );
};
