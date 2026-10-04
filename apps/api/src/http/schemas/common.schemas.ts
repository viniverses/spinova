import { t as Type, type Static } from "elysia";

export const DateTimeStringSchema = Type.String({ format: "date-time" });

export const NullableStringSchema = Type.Nullable(Type.String());

export const PaginationSchema = Type.Object({
  page: Type.Integer({ minimum: 1 }),
  pageSize: Type.Integer({ minimum: 1, maximum: 100 }),
  totalItems: Type.Integer({ minimum: 0 }),
  totalPages: Type.Integer({ minimum: 0 }),
});

export type PaginationDto = Static<typeof PaginationSchema>;
