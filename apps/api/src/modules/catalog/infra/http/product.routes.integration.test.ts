import { Elysia } from "elysia";
import { describe, expect, it, vi } from "vitest";

import { errorHandlerPlugin } from "../../../../http/plugins/error-handler.ts";
import type { IProductRepository } from "../../domain/repositories/product.repository.interface.ts";
import { createProductRoutes } from "./product.routes.ts";

describe("Product Routes Integration (Dependency Injection)", () => {
  it("injects mock product repository and handles GET /products", async () => {
    const mockListResult = {
      items: [
        {
          id: "prod-1",
          albumId: "album-1",
          title: "Test Vinyl",
          artist: { id: "art-1", name: "Artist", slug: "artist" },
          sku: "SKU-1",
          format: "vinyl" as const,
          edition: "standard" as const,
          price: "100.00",
          compareAtPrice: null,
          currency: "BRL" as const,
          stockQuantity: 5,
          inStock: true,
          isImported: false,
          genre: "Rock",
          releaseDate: "2024-01-01",
          image: null,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
      },
    };

    const mockRepo: IProductRepository = {
      list: vi.fn().mockResolvedValue(mockListResult),
      findById: vi.fn(),
    };

    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(createProductRoutes({ productRepository: mockRepo }));

    const response = await app.handle(new Request("http://localhost/products"));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({
      data: mockListResult.items,
      pagination: mockListResult.pagination,
    });
    expect(mockRepo.list).toHaveBeenCalled();
  });

  it("handles GET /products/:id when product exists", async () => {
    const mockProduct = {
      id: "prod-1",
      albumId: "album-1",
      title: "Test Vinyl",
      artist: { id: "art-1", name: "Artist", slug: "artist" },
      sku: "SKU-1",
      format: "vinyl" as const,
      edition: "standard" as const,
      price: "100.00",
      compareAtPrice: null,
      currency: "BRL" as const,
      stockQuantity: 5,
      inStock: true,
      isImported: false,
      genre: "Rock",
      releaseDate: "2024-01-01",
      image: null,
      images: [],
      description: "Album description",
      tags: ["rock", "vinyl"],
      categories: [],
      rating: { average: 4.5, count: 10 },
      unitsSold: 25,
      createdAt: "2024-01-01T00:00:00.000Z",
    };

    const mockRepo: IProductRepository = {
      list: vi.fn(),
      findById: vi.fn().mockResolvedValue(mockProduct),
    };

    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(createProductRoutes({ productRepository: mockRepo }));

    const response = await app.handle(
      new Request("http://localhost/products/prod-1"),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ data: mockProduct });
    expect(mockRepo.findById).toHaveBeenCalledWith("prod-1");
  });

  it("returns 404 when product is not found", async () => {
    const mockRepo: IProductRepository = {
      list: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
    };

    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(createProductRoutes({ productRepository: mockRepo }));

    const response = await app.handle(
      new Request("http://localhost/products/non-existent"),
    );

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error.code).toBe("PRODUCT_NOT_FOUND");
  });
});
