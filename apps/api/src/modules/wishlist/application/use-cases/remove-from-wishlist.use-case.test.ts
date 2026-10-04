import { describe, expect, it, vi } from "vitest";

import { WishlistEntryNotFoundError } from "../../domain/wishlist.errors.ts";
import type { IWishlistRepository } from "../../application/ports/wishlist.repository.interface.ts";
import { RemoveFromWishlistUseCase } from "./remove-from-wishlist.use-case.ts";

describe("RemoveFromWishlistUseCase", () => {
  it("removes product from wishlist", async () => {
    const mockRepo: IWishlistRepository = {
      findByUserId: vi.fn(),
      add: vi.fn(),
      remove: vi.fn().mockResolvedValue({ kind: "removed" }),
    };

    const useCase = new RemoveFromWishlistUseCase(mockRepo);
    await useCase.execute({ userId: "user-123", productId: "prod-1" });

    expect(mockRepo.remove).toHaveBeenCalledWith("user-123", "prod-1");
  });

  it("maps not-found result to WishlistEntryNotFoundError", async () => {
    const mockRepo: IWishlistRepository = {
      findByUserId: vi.fn(),
      add: vi.fn(),
      remove: vi.fn().mockResolvedValue({ kind: "not-found" }),
    };

    const useCase = new RemoveFromWishlistUseCase(mockRepo);
    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-missing" }),
    ).rejects.toThrow(WishlistEntryNotFoundError);
  });
});
