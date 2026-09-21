import { pgEnum } from "drizzle-orm/pg-core";

export const inventoryMovementType = pgEnum("inventory_movement_type", [
  "inbound",
  "outbound",
  "adjustment",
]);
