import type { IWishlistRepository } from "../../application/ports/wishlist.repository.interface.ts";
import { WishlistEntryNotFoundError } from "../../domain/wishlist.errors.ts";

export type RemoveFromWishlistInput = {
  userId: string;
  productId: string;
};

export class RemoveFromWishlistUseCase {
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async execute(input: RemoveFromWishlistInput): Promise<void> {
    const result = await this.wishlistRepository.remove(
      input.userId,
      input.productId,
    );
    if (result.kind === "not-found") {
      throw new WishlistEntryNotFoundError(input.productId);
    }
  }
}
