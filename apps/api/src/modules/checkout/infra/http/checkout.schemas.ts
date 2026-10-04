import { t as Type, type Static } from "elysia";

import { DateTimeStringSchema } from "../../../../http/schemas/common.schemas.ts";
import { MoneySchema } from "../../../../http/schemas/money.schemas.ts";
import {
  createErrorResponseSchema,
  InternalServerErrorResponseSchema,
  UnauthorizedResponseSchema,
} from "../../../../http/schemas/error.schemas.ts";

export { InternalServerErrorResponseSchema, UnauthorizedResponseSchema };

export const OrderStatusSchema = Type.Union([
  Type.Literal("pending"),
  Type.Literal("paid"),
  Type.Literal("processing"),
  Type.Literal("shipped"),
  Type.Literal("delivered"),
  Type.Literal("cancelled"),
  Type.Literal("refunded"),
]);

export const CompletedOrderSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  status: OrderStatusSchema,
  total: MoneySchema,
  currency: Type.Literal("BRL"),
  createdAt: DateTimeStringSchema,
});

export const CompletedOrderResponseSchema = Type.Object({
  data: CompletedOrderSchema,
});

export const CheckoutBadRequestResponseSchema = createErrorResponseSchema(
  "The cart is empty or the user has no delivery address.",
);

export const CheckoutConflictResponseSchema = createErrorResponseSchema(
  "One or more cart items no longer have sufficient stock.",
);

export type CompletedOrderDto = Static<typeof CompletedOrderSchema>;
