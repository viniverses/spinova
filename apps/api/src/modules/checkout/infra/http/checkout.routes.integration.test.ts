import { auth } from "@spinova/auth";
import { Elysia } from "elysia";
import { describe, expect, it, vi } from "vitest";

import { errorHandlerPlugin } from "../../../../http/plugins/error-handler.ts";
import type { CompletedOrderResult } from "../../application/ports/checkout-transaction.ts";
import type { CheckoutCart } from "../../application/use-cases/checkout-cart.use-case.ts";
import { InsufficientStockError } from "../../domain/checkout.errors.ts";
import { createCheckoutRoutes } from "./checkout.routes.ts";

describe("Checkout Routes Integration (Dependency Injection)", () => {
  it("creates an order from the authenticated cart", async () => {
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

    const completed: CompletedOrderResult = {
      id: "c0000000-0000-0000-0000-000000000001",
      status: "pending",
      total: "200.00",
      currency: "BRL",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };
    const checkoutCart: CheckoutCart = {
      execute: vi.fn().mockResolvedValue(completed),
    };

    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(
        createCheckoutRoutes({
          checkoutCart,
        }),
      );

    const response = await app.handle(
      new Request("http://localhost/orders", {
        method: "POST",
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(201);
    expect((await response.json()).data).toMatchObject({
      id: completed.id,
      total: completed.total,
      currency: completed.currency,
    });
    expect(checkoutCart.execute).toHaveBeenCalledWith({ userId: "user-123" });
  });

  it("maps checkout errors in the checkout HTTP adapter", async () => {
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

    const productId = "a0000000-0000-0000-0000-000000000001";
    const checkoutCart: CheckoutCart = {
      execute: vi.fn().mockRejectedValue(new InsufficientStockError(productId)),
    };
    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(createCheckoutRoutes({ checkoutCart }));

    const response = await app.handle(
      new Request("http://localhost/orders", {
        method: "POST",
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "INSUFFICIENT_STOCK",
        message: "The requested quantity is not available.",
        details: { productId },
      },
    });
  });
});
