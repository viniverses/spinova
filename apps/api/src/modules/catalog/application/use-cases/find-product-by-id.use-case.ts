import { ProductNotFoundError } from "../../domain/product.errors.ts";
import type { ProductDetail } from "../../domain/product.types.ts";
import type { IProductRepository } from "../../domain/repositories/product.repository.interface.ts";

export type FindProductByIdInput = {
  id: string;
};

export class FindProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: FindProductByIdInput): Promise<ProductDetail> {
    const product = await this.productRepository.findById(input.id);
    if (!product) {
      throw new ProductNotFoundError(input.id);
    }
    return product;
  }
}
