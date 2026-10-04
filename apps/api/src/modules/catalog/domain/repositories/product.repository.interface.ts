import type {
  ProductCatalogPage,
  ProductDetail,
  ProductListFilters,
} from "../product.types.ts";

export interface IProductRepository {
  list(filters: ProductListFilters): Promise<ProductCatalogPage>;
  findById(id: string): Promise<ProductDetail | null>;
}
