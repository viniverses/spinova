import { t as Type } from "elysia";

import { createErrorResponseSchema } from "../../schemas/error.schemas.ts";
import { MoneySchema } from "../../schemas/money.schemas.ts";

export {
  InternalServerErrorResponseSchema,
  ValidationErrorResponseSchema,
} from "../../schemas/error.schemas.ts";

export const CompletedOrderSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  status: Type.Literal("pending"),
  total: MoneySchema,
  currency: Type.Literal("BRL"),
  createdAt: Type.String({ format: "date-time" }),
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

export const UnauthorizedResponseSchema = createErrorResponseSchema(
  "Authentication required.",
);
