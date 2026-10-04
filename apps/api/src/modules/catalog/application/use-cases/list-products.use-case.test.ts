import { describe, expect, it, vi } from "vitest";
import type { IProductRepository } from "../../domain/repositories/product.repository.interface.ts";
import { ListProductsUseCase } from "./list-products.use-case.ts";

describe("ListProductsUseCase", () => {
  it("calls repository.list with filters and returns result", async () => {
    const mockPage = {
      items: [],
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
      },
    };

    const mockRepo: IProductRepository = {
      list: vi.fn().mockResolvedValue(mockPage),
      findById: vi.fn(),
    };

    const useCase = new ListProductsUseCase(mockRepo);
    const result = await useCase.execute({});

    expect(result).toBe(mockPage);
    expect(mockRepo.list).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      search: undefined,
      format: undefined,
      edition: undefined,
      artist: undefined,
      genre: undefined,
      category: undefined,
      tag: undefined,
      section: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      isImported: undefined,
      onSale: undefined,
      hasSales: undefined,
      sort: "newest",
    });
  });

  it("validates filter combinations before calling the repository", async () => {
    const mockRepo: IProductRepository = {
      list: vi.fn(),
      findById: vi.fn(),
    };

    const useCase = new ListProductsUseCase(mockRepo);

    await expect(
      useCase.execute({ collection: "imported", isImported: false }),
    ).rejects.toMatchObject({ code: "CONFLICTING_FILTERS" });
    expect(mockRepo.list).not.toHaveBeenCalled();
  });
});
