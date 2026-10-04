import type { IWishlistRepository } from "../../application/ports/wishlist.repository.interface.ts";
import type { WishlistItem } from "../../application/wishlist-item.ts";

export type GetWishlistInput = {
  userId: string;
};

export class GetWishlistUseCase {
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async execute(input: GetWishlistInput): Promise<WishlistItem[]> {
    return this.wishlistRepository.findByUserId(input.userId);
  }
}
