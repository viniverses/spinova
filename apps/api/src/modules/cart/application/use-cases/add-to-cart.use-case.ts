import type { ProductStockReader } from "../ports/product-stock-reader.interface.ts";
import {
  InsufficientStockError,
  ProductNotFoundError,
} from "../../domain/cart.errors.ts";
import type { ICartRepository } from "../../domain/repositories/cart.repository.interface.ts";

export type AddToCartInput = {
  userId: string;
  productId: string;
};

export class AddToCartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly productStockReader: ProductStockReader,
  ) {}

  async execute(input: AddToCartInput): Promise<void> {
    const cart = await this.cartRepository.getCartByUserId(input.userId);
    const originalCart = cart.clone();
    const stockSnapshot = await this.productStockReader.getProductStock(
      input.productId,
    );
    if (stockSnapshot === null) {
      throw new ProductNotFoundError(input.productId);
    }
    if (stockSnapshot.stockQuantity < 1) {
      throw new InsufficientStockError(input.productId);
    }

    cart.addItem(stockSnapshot.product, stockSnapshot.stockQuantity);
    await this.cartRepository.save(input.userId, cart, originalCart);

  }
}
