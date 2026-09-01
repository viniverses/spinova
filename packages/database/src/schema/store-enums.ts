import { pgEnum } from "drizzle-orm/pg-core";

export const productFormat = pgEnum("product_format", [
  "vinyl",
  "cd",
  "cassette",
]);

export const productEdition = pgEnum("product_edition", [
  "standard",
  "deluxe",
  "colored",
]);

export const categoryType = pgEnum("category_type", [
  "genre",
  "tag",
  "curated",
]);

export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const featuredSectionType = pgEnum("featured_section_type", [
  "banner",
  "carousel",
]);

export const discountType = pgEnum("discount_type", ["percentage", "fixed"]);

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

export const inventoryMovementType = pgEnum("inventory_movement_type", [
  "inbound",
  "outbound",
  "adjustment",
]);
