import { describe, expect, it, vi } from "vitest";
import { ProductNotFoundError } from "../../domain/product.errors.ts";
import type { IProductRepository } from "../../domain/repositories/product.repository.interface.ts";
import { FindProductByIdUseCase } from "./find-product-by-id.use-case.ts";

describe("FindProductByIdUseCase", () => {
  it("returns product detail when found", async () => {
    const mockProduct = {
      id: "prod-1",
      albumId: "album-1",
      title: "Test Product",
      artist: { id: "art-1", name: "Test Artist", slug: "test-artist" },
      sku: "SKU-1",
      format: "vinyl" as const,
      edition: "standard" as const,
      price: "100.00",
      compareAtPrice: null,
      currency: "BRL" as const,
      stockQuantity: 10,
      inStock: true,
      isImported: false,
      genre: "Rock",
      releaseDate: "2024-01-01",
      image: null,
      images: [],
      description: null,
      tags: [],
      categories: [],
      rating: { average: null, count: 0 },
      unitsSold: 0,
      createdAt: "2024-01-01T00:00:00.000Z",
    };

    const mockRepo: IProductRepository = {
      list: vi.fn(),
      findById: vi.fn().mockResolvedValue(mockProduct),
    };

    const useCase = new FindProductByIdUseCase(mockRepo);
    const result = await useCase.execute({ id: "prod-1" });

    expect(result).toBe(mockProduct);
    expect(mockRepo.findById).toHaveBeenCalledWith("prod-1");
  });

  it("throws ProductNotFoundError when product does not exist", async () => {
    const mockRepo: IProductRepository = {
      list: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
    };

    const useCase = new FindProductByIdUseCase(mockRepo);

    await expect(useCase.execute({ id: "prod-not-found" })).rejects.toThrow(
      ProductNotFoundError,
    );
  });
});
