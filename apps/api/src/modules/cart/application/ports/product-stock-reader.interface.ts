import type { CartProduct } from "../../domain/cart-product.ts";

export interface ProductStockSnapshot {
  product: CartProduct;
  stockQuantity: number;
}

export interface ProductStockReader {
  getProductStock(productId: string): Promise<ProductStockSnapshot | null>;
}
