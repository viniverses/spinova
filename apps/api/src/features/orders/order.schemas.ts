import { t as Type, type Static } from "elysia";

import {
  DateTimeStringSchema,
  NullableStringSchema,
} from "../../schemas/common.schemas.ts";
import { createErrorResponseSchema } from "../../schemas/error.schemas.ts";
import { MoneySchema } from "../../schemas/money.schemas.ts";
import {
  ProductFormatSchema,
  ProductImageSchema,
} from "../../schemas/product-summary.schemas.ts";

export {
  InternalServerErrorResponseSchema,
  ValidationErrorResponseSchema,
} from "../../schemas/error.schemas.ts";

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

export const OrderAddressSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  label: Type.String(),
  street: Type.String(),
  number: Type.String(),
  complement: NullableStringSchema,
  neighborhood: NullableStringSchema,
  city: Type.String(),
  state: Type.String(),
  zipCode: Type.String(),
  country: Type.String(),
});

export const OrderItemProductSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  artist: Type.Object({
    name: Type.String(),
  }),
  format: ProductFormatSchema,
  image: Type.Union([ProductImageSchema, Type.Null()]),
});

export const OrderItemSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  productId: Type.String({ format: "uuid" }),
  quantity: Type.Integer({ minimum: 1 }),
  unitPrice: MoneySchema,
  product: OrderItemProductSchema,
});

export const OrderDetailSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  status: OrderStatusSchema,
  total: MoneySchema,
  currency: Type.Literal("BRL"),
  createdAt: DateTimeStringSchema,
  itemsCount: Type.Integer({ minimum: 0 }),
  items: Type.Array(OrderItemSchema),
  address: OrderAddressSchema,
});

export type OrderDetail = Static<typeof OrderDetailSchema>;

export const PaginationSchema = Type.Object({
  page: Type.Integer({ minimum: 1 }),
  pageSize: Type.Integer({ minimum: 1, maximum: 100 }),
  totalItems: Type.Integer({ minimum: 0 }),
  totalPages: Type.Integer({ minimum: 0 }),
});

export const OrderListQuerySchema = Type.Object(
  {
    page: Type.Optional(
      Type.Integer({
        minimum: 1,
        default: 1,
        description: "Requested page, starting at 1.",
      }),
    ),
    pageSize: Type.Optional(
      Type.Integer({
        minimum: 1,
        maximum: 50,
        default: 20,
        description: "Number of orders per page, from 1 to 50.",
      }),
    ),
  },
  { additionalProperties: false },
);

export type OrderListQuery = Static<typeof OrderListQuerySchema>;

export const OrderListResponseSchema = Type.Object({
  data: Type.Array(OrderDetailSchema),
  pagination: PaginationSchema,
});

export const OrderDetailResponseSchema = Type.Object({
  data: OrderDetailSchema,
});

export const OrderParamsSchema = Type.Object(
  {
    id: Type.String({
      format: "uuid",
      description: "Order identifier.",
    }),
  },
  { additionalProperties: false },
);

export const CheckoutBadRequestResponseSchema = createErrorResponseSchema(
  "The cart is empty or the user has no delivery address.",
);

export const CheckoutConflictResponseSchema = createErrorResponseSchema(
  "One or more cart items no longer have sufficient stock.",
);

export const UnauthorizedResponseSchema = createErrorResponseSchema(
  "Authentication required.",
);

export const NotFoundResponseSchema = createErrorResponseSchema(
  "No order was found for the provided identifier.",
);
