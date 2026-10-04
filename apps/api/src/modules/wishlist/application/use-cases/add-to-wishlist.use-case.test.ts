import { describe, expect, it, vi } from "vitest";

import {
  ProductNotFoundError,
  WishlistDuplicateError,
} from "../../domain/wishlist.errors.ts";
import type { IWishlistRepository } from "../../application/ports/wishlist.repository.interface.ts";
import type { WishlistEntry } from "../../domain/wishlist.types.ts";
import { AddToWishlistUseCase } from "./add-to-wishlist.use-case.ts";

describe("AddToWishlistUseCase", () => {
  it("adds product to wishlist and returns entry", async () => {
    const mockEntry: WishlistEntry = {
      id: "wish-1",
      productId: "prod-1",
      createdAt: "2024-01-01T00:00:00.000Z",
    };

    const mockRepo: IWishlistRepository = {
      findByUserId: vi.fn(),
      add: vi.fn().mockResolvedValue({ kind: "added", entry: mockEntry }),
      remove: vi.fn(),
    };

    const useCase = new AddToWishlistUseCase(mockRepo);
    const result = await useCase.execute({
      userId: "user-123",
      productId: "prod-1",
    });

    expect(mockRepo.add).toHaveBeenCalledWith("user-123", "prod-1");
    expect(result).toEqual(mockEntry);
  });

  it("maps product-not-found result to ProductNotFoundError", async () => {
    const mockRepo: IWishlistRepository = {
      findByUserId: vi.fn(),
      add: vi.fn().mockResolvedValue({ kind: "product-not-found" }),
      remove: vi.fn(),
    };

    const useCase = new AddToWishlistUseCase(mockRepo);
    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-missing" }),
    ).rejects.toThrow(ProductNotFoundError);
  });

  it("maps duplicate result to WishlistDuplicateError", async () => {
    const mockRepo: IWishlistRepository = {
      findByUserId: vi.fn(),
      add: vi.fn().mockResolvedValue({ kind: "duplicate" }),
      remove: vi.fn(),
    };

    const useCase = new AddToWishlistUseCase(mockRepo);
    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-1" }),
    ).rejects.toThrow(WishlistDuplicateError);
  });
});
