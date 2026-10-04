import { t as Type, type Static } from "elysia";

import {
  DateTimeStringSchema,
  NullableStringSchema,
  PaginationSchema,
  type PaginationDto,
} from "../../../../http/schemas/common.schemas.ts";
import { MoneySchema } from "../../../../http/schemas/money.schemas.ts";
import {
  ProductFormatSchema,
  ProductImageSchema,
} from "../../../../http/schemas/product-summary.schemas.ts";
import {
  ConflictResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
  ValidationErrorResponseSchema,
} from "../../../../http/schemas/error.schemas.ts";

export {
  ConflictResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
  ValidationErrorResponseSchema,
};

export const OrderStatusSchema = Type.Union([
  Type.Literal("pending"),
  Type.Literal("paid"),
  Type.Literal("processing"),
  Type.Literal("shipped"),
  Type.Literal("delivered"),
  Type.Literal("cancelled"),
  Type.Literal("refunded"),
]);

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
  image: Type.Nullable(ProductImageSchema),
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

export { PaginationSchema };

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

export type OrderStatus = Static<typeof OrderStatusSchema>;
export type OrderDetailDto = OrderDetail;
export type PaginationMetaDto = Static<typeof PaginationSchema>;
export type PaginatedOrdersDto = Static<typeof OrderListResponseSchema>;
export type OrderParams = Static<typeof OrderParamsSchema>;
