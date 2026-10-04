import { auth } from "@spinova/auth";
import { Elysia } from "elysia";
import { describe, expect, it, vi } from "vitest";

import { errorHandlerPlugin } from "../../../../http/plugins/error-handler.ts";
import type { ProductStockReader } from "../../application/ports/product-stock-reader.interface.ts";
import { createCartRoutes } from "./cart.routes.ts";
import { CartEntity } from "../../domain/entities/index.ts";
import type { ICartRepository } from "../../domain/repositories/cart.repository.interface.ts";
import { DefaultPricingPolicy } from "../../../pricing/index.ts";

describe("Cart Routes Integration (Dependency Injection)", () => {
  it("returns the quoted catalog view after adding a product", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue({
      user: { id: "user-123", email: "test@example.com", name: "Test User", emailVerified: true, createdAt: new Date(), updatedAt: new Date() },
      session: { id: "sess-1", userId: "user-123", token: "tok-1", expiresAt: new Date(Date.now() + 100000), createdAt: new Date(), updatedAt: new Date() },
    });
    const productId = "a0000000-0000-0000-0000-000000000001";
    const product = {
      id: productId, albumId: "album-1", title: "Album",
      artist: { id: "artist-1", name: "Artist", slug: "artist" },
      sku: "SKU-1", format: "vinyl" as const, edition: "standard" as const,
      price: "12.35", compareAtPrice: null, currency: "BRL" as const,
      stockQuantity: 5, inStock: true, isImported: false,
      genre: null, releaseDate: null, image: null,
    };
    const cartRepository: ICartRepository = {
      getCartByUserId: vi.fn().mockResolvedValue(CartEntity.empty()),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const cartReader = {
      getCartByUserId: vi.fn().mockResolvedValue({
        id: "cart-1", items: [{ id: "item-1", quantity: 1, product }],
      }),
    };
    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(createCartRoutes({
        cartRepository,
        cartReader,
        productStockReader: { getProductStock: vi.fn().mockResolvedValue({ product: { id: productId, price: "12.35" }, stockQuantity: 5 }) },
        pricingCalculator: new DefaultPricingPolicy(),
      }));

    const response = await app.handle(new Request(`http://localhost/cart/items/${productId}`, {
      method: "POST", headers: { authorization: "Bearer valid-token" },
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: {
        id: "cart-1", items: [{ id: "item-1", quantity: 1, product }],
        subtotal: "12.35", shipping: "15.00", total: "27.35", totalQuantity: 1, currency: "BRL",
      },
    });
    expect(cartRepository.save).toHaveBeenCalledTimes(1);
    expect(cartReader.getCartByUserId).toHaveBeenCalledExactlyOnceWith("user-123");
  });

  it("injects mock cart repository and handles GET /cart", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue({
      user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "sess-1",
        userId: "user-123",
        token: "tok-1",
        expiresAt: new Date(Date.now() + 100000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const mockCart = CartEntity.empty();

    const mockRepo: ICartRepository = {
      getCartByUserId: vi.fn().mockResolvedValue(mockCart),
      save: vi.fn(),
    };
    const productStockReader: ProductStockReader = {
      getProductStock: vi.fn(),
    };

    const pricingCalculator = new DefaultPricingPolicy();
    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(
        createCartRoutes({
          cartRepository: mockRepo,
          cartReader: { getCartByUserId: vi.fn().mockResolvedValue({ id: null, items: [] }) },
          productStockReader,
          pricingCalculator,
        }),
      );

    const response = await app.handle(
      new Request("http://localhost/cart", {
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({
      data: { id: null, items: [], subtotal: "0.00", shipping: "0.00", total: "0.00", totalQuantity: 0, currency: "BRL" },
    });
    expect(mockRepo.getCartByUserId).not.toHaveBeenCalled();
  });

  it("preserves CART_ITEM_NOT_FOUND when PATCH references a missing product", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue({
      user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "sess-1",
        userId: "user-123",
        token: "tok-1",
        expiresAt: new Date(Date.now() + 100000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const mockCartRepo: ICartRepository = {
      getCartByUserId: vi.fn().mockResolvedValue(CartEntity.empty()),
      save: vi.fn(),
    };
    const productStockReader: ProductStockReader = {
      getProductStock: vi.fn().mockResolvedValue(null),
    };
    const productId = "a0000000-0000-0000-0000-000000000001";

    const pricingCalculator = new DefaultPricingPolicy();
    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(
        createCartRoutes({
          cartRepository: mockCartRepo,
          cartReader: { getCartByUserId: vi.fn() },
          productStockReader,
          pricingCalculator,
        }),
      );

    const response = await app.handle(
      new Request(`http://localhost/cart/items/${productId}`, {
        method: "PATCH",
        headers: {
          authorization: "Bearer valid-token",
          "content-type": "application/json",
        },
        body: JSON.stringify({ quantity: 2 }),
      }),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "CART_ITEM_NOT_FOUND" },
    });
  });
});
