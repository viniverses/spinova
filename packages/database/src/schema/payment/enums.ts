import { pgEnum } from "drizzle-orm/pg-core";

export const paymentMethod = pgEnum("payment_method", [
  "pix",
  "credit_card",
  "boleto",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
  "refunded",
]);
