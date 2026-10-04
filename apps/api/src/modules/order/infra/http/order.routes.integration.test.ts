import { auth } from "@spinova/auth";
import { Elysia } from "elysia";
import { describe, expect, it, vi } from "vitest";

import { Money } from "../../../../shared/value-objects/money.ts";
import { errorHandlerPlugin } from "../../../../http/plugins/error-handler.ts";
import { Order } from "../../domain/entities/order.entity.ts";
import type { IOrderRepository } from "../../domain/repositories/order.repository.interface.ts";
import { createOrderRoutes } from "./order.routes.ts";

describe("Order Routes Integration (Dependency Injection)", () => {
  it("injects mock order repository and handles GET /orders/:id", async () => {
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

    const orderId = "a0000000-0000-0000-0000-000000000001";
    const addressId = "b0000000-0000-0000-0000-000000000001";
    const mockOrder = new Order({
      id: orderId,
      userId: "user-123",
      status: "pending" as const,
      currency: "BRL" as const,
      total: Money.fromDecimal("100.00"),
      addressId,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      items: [],
      address: {
        id: addressId,
        label: "Casa",
        street: "Rua das Flores",
        number: "123",
        complement: null,
        neighborhood: null,
        city: "São Paulo",
        state: "SP",
        zipCode: "01001-000",
        country: "BR",
      },
    });

    const mockRepo: IOrderRepository = {
      findById: vi.fn().mockResolvedValue(mockOrder),
      listByUser: vi.fn(),
    };
    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(
        createOrderRoutes({
          orderRepository: mockRepo,
        }),
      );

    const response = await app.handle(
      new Request(`http://localhost/orders/${orderId}`, {
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.id).toBe(orderId);
    expect(json.data.status).toBe("pending");
    expect(json.data.total).toBe("100.00");
    expect(json.data.address.label).toBe("Casa");
    expect(mockRepo.findById).toHaveBeenCalledWith("user-123", orderId);
  });

  it("maps order errors in the order HTTP adapter", async () => {
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

    const orderId = "a0000000-0000-0000-0000-000000000001";
    const mockRepo: IOrderRepository = {
      findById: vi.fn().mockResolvedValue(null),
      listByUser: vi.fn(),
    };
    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(createOrderRoutes({ orderRepository: mockRepo }));

    const response = await app.handle(
      new Request(`http://localhost/orders/${orderId}`, {
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "ORDER_NOT_FOUND",
        message: "Order not found.",
        details: { orderId },
      },
    });
  });
});
