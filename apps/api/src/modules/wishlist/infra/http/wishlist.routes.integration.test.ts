import { auth } from "@spinova/auth";
import { Elysia } from "elysia";
import { describe, expect, it, vi } from "vitest";

import { errorHandlerPlugin } from "../../../../http/plugins/error-handler.ts";
import type { IWishlistRepository } from "../../application/ports/wishlist.repository.interface.ts";
import type { WishlistItemDto } from "./wishlist.schemas.ts";
import { createWishlistRoutes } from "./wishlist.routes.ts";

describe("Wishlist Routes Integration (Dependency Injection)", () => {
  it("injects mock wishlist repository and handles GET /wishlist", async () => {
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

    const mockWishlist: WishlistItemDto[] = [];

    const mockRepo: IWishlistRepository = {
      findByUserId: vi.fn().mockResolvedValue(mockWishlist),
      add: vi.fn(),
      remove: vi.fn(),
    };

    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(createWishlistRoutes({ wishlistRepository: mockRepo }));

    const response = await app.handle(
      new Request("http://localhost/wishlist", {
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ data: mockWishlist });
    expect(mockRepo.findByUserId).toHaveBeenCalledWith("user-123");
  });

  it("returns 404 when adding a product that does not exist", async () => {
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

    const productId = "00000000-0000-0000-0000-000000000001";
    const mockRepo: IWishlistRepository = {
      findByUserId: vi.fn(),
      add: vi.fn().mockResolvedValue({ kind: "product-not-found" }),
      remove: vi.fn(),
    };

    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(createWishlistRoutes({ wishlistRepository: mockRepo }));

    const response = await app.handle(
      new Request(`http://localhost/wishlist/${productId}`, {
        method: "POST",
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "PRODUCT_NOT_FOUND",
        message: "Product not found.",
        details: { productId },
      },
    });
    expect(mockRepo.add).toHaveBeenCalledWith("user-123", productId);
  });
});
