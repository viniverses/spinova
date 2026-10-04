import { db, products } from "@spinova/database";
import { eq } from "@spinova/database/query";

import type { ProductStockReader, ProductStockSnapshot } from "../../application/ports/product-stock-reader.interface.ts";

export class DrizzleProductStockReader implements ProductStockReader {
  async getProductStock(productId: string): Promise<ProductStockSnapshot | null> {
    const [product] = await db
      .select({ id: products.id, price: products.price, stockQuantity: products.stockQuantity })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) return null;

    return {
      product: { id: product.id, price: product.price },
      stockQuantity: product.stockQuantity,
    };
  }
}
