import type { IWishlistRepository } from "../../application/ports/wishlist.repository.interface.ts";
import {
  ProductNotFoundError,
  WishlistDuplicateError,
} from "../../domain/wishlist.errors.ts";
import type { WishlistEntry } from "../../domain/wishlist.types.ts";

export type AddToWishlistInput = {
  userId: string;
  productId: string;
};

export class AddToWishlistUseCase {
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async execute(input: AddToWishlistInput): Promise<WishlistEntry> {
    const result = await this.wishlistRepository.add(
      input.userId,
      input.productId,
    );

    switch (result.kind) {
      case "added":
        return result.entry;
      case "product-not-found":
        throw new ProductNotFoundError(input.productId);
      case "duplicate":
        throw new WishlistDuplicateError(input.productId);
    }
  }
}
