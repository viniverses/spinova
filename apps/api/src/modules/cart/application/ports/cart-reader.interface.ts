import type { ProductSummary } from "../../../catalog/index.ts";

export interface CartReadModel {
  id: string | null;
  items: readonly {
    id: string;
    quantity: number;
    product: ProductSummary;
  }[];
}

export interface CartReader {
  getCartByUserId(userId: string): Promise<CartReadModel>;
}
