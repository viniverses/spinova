import { t as Type } from "elysia";

export const DateTimeStringSchema = Type.String({ format: "date-time" });

export const NullableStringSchema = Type.Union([Type.String(), Type.Null()]);
