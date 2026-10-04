import type { ProductStockReader } from "../ports/product-stock-reader.interface.ts";
import { CartItemNotFoundError } from "../../domain/cart.errors.ts";
import type { ICartRepository } from "../../domain/repositories/cart.repository.interface.ts";

export type UpdateCartQuantityInput = {
  userId: string;
  productId: string;
  quantity: number;
};

export class UpdateCartQuantityUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly productStockReader: ProductStockReader,
  ) {}

  async execute(input: UpdateCartQuantityInput): Promise<void> {
    const cart = await this.cartRepository.getCartByUserId(input.userId);
    const originalCart = cart.clone();

    if (input.quantity === 0) {
      cart.removeItem(input.productId);
    } else {
      const stockSnapshot = await this.productStockReader.getProductStock(
        input.productId,
      );
      if (stockSnapshot === null) {
        throw new CartItemNotFoundError(input.productId);
      }
      cart.changeQuantity(
        input.productId,
        input.quantity,
        stockSnapshot.stockQuantity,
      );
    }

    await this.cartRepository.save(input.userId, cart, originalCart);

  }
}
