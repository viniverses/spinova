import type { ProductSummary } from "../../catalog/index.ts";

export interface WishlistItem {
  id: string;
  product: ProductSummary;
  createdAt: string;
}
