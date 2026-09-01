import { t as Type } from "elysia";

export const MoneySchema = Type.String({
  pattern: "^(?:0|[1-9]\\d*)\\.\\d{2}$",
  description: "Exact decimal monetary amount with two decimal places.",
  examples: ["105.90"],
});

export const NullableMoneySchema = Type.Union([MoneySchema, Type.Null()]);
