import { describe, expect, it, vi } from "vitest";

import type { IWishlistRepository } from "../../application/ports/wishlist.repository.interface.ts";
import type { WishlistItem } from "../../application/wishlist-item.ts";
import { GetWishlistUseCase } from "./get-wishlist.use-case.ts";

describe("GetWishlistUseCase", () => {
  it("returns user's wishlist items", async () => {
    const mockItems: WishlistItem[] = [
      {
        id: "wish-1",
        product: {
          id: "prod-1",
          albumId: "alb-1",
          title: "Album",
          artist: { id: "art-1", name: "Artist", slug: "artist" },
          sku: "SKU-1",
          format: "vinyl",
          edition: "standard",
          price: "150.00",
          compareAtPrice: null,
          currency: "BRL",
          stockQuantity: 5,
          inStock: true,
          isImported: false,
          genre: "Rock",
          releaseDate: "2024-01-01",
          image: null,
        },
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];

    const mockRepo: IWishlistRepository = {
      findByUserId: vi.fn().mockResolvedValue(mockItems),
      add: vi.fn(),
      remove: vi.fn(),
    };

    const useCase = new GetWishlistUseCase(mockRepo);
    const result = await useCase.execute({ userId: "user-123" });

    expect(mockRepo.findByUserId).toHaveBeenCalledWith("user-123");
    expect(result).toEqual(mockItems);
  });
});
