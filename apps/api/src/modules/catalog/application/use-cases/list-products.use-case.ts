import type { ProductCatalogPage } from "../../domain/product.types.ts";
import type { IProductRepository } from "../../domain/repositories/product.repository.interface.ts";
import {
  normalizeProductListFilters,
  type ProductListInput,
} from "../product-list-filters.ts";

export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: ProductListInput): Promise<ProductCatalogPage> {
    const filters = normalizeProductListFilters(input);
    return this.productRepository.list(filters);
  }
}
