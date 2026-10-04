import { auth } from "@spinova/auth";
import { Elysia } from "elysia";
import { describe, expect, it, vi } from "vitest";

import { errorHandlerPlugin } from "../../../../http/plugins/error-handler.ts";
import type { AddressOrderLookup } from "../../application/ports/address-order-lookup.interface.ts";
import { createAddressRoutes } from "./address.routes.ts";
import type { AddressDto } from "./address.schemas.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";

describe("Address Routes Integration (Dependency Injection)", () => {
  it("injects mock address repository and handles GET /addresses", async () => {
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

    const mockAddresses: AddressDto[] = [
      {
        id: "a0000000-0000-0000-0000-000000000001",
        label: "Casa",
        street: "Rua Exemplo",
        number: "123",
        complement: null,
        neighborhood: null,
        city: "São Paulo",
        state: "SP",
        zipCode: "01001-000",
        country: "BR",
        isDefault: true,
      },
    ];

    const mockRepo: IAddressRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn().mockResolvedValue(mockAddresses),
      findDefaultByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const addressOrderLookup: AddressOrderLookup = {
      hasOrdersByAddressId: vi.fn(),
    };

    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(
        createAddressRoutes({
          addressRepository: mockRepo,
          addressOrderLookup,
        }),
      );

    const response = await app.handle(
      new Request("http://localhost/addresses", {
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ data: mockAddresses });
    expect(mockRepo.findByUserId).toHaveBeenCalledWith("user-123");
  });

  it("injects mock address repository and handles DELETE /addresses/:addressId", async () => {
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

    const targetAddressId = "a0000000-0000-0000-0000-000000000001";
    const mockRepo: IAddressRepository = {
      findById: vi.fn().mockResolvedValue({ id: targetAddressId }),
      findByUserId: vi.fn(),
      findDefaultByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    const addressOrderLookup: AddressOrderLookup = {
      hasOrdersByAddressId: vi.fn().mockResolvedValue(false),
    };

    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(
        createAddressRoutes({
          addressRepository: mockRepo,
          addressOrderLookup,
        }),
      );

    const response = await app.handle(
      new Request(`http://localhost/addresses/${targetAddressId}`, {
        method: "DELETE",
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ status: "deleted" });
    expect(mockRepo.delete).toHaveBeenCalledWith("user-123", targetAddressId);
  });

  it("maps address errors in the address HTTP adapter", async () => {
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

    const addressId = "a0000000-0000-0000-0000-000000000001";
    const mockRepo: IAddressRepository = {
      findById: vi.fn().mockResolvedValue(null),
      findByUserId: vi.fn(),
      findDefaultByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const addressOrderLookup: AddressOrderLookup = {
      hasOrdersByAddressId: vi.fn(),
    };
    const app = new Elysia({ normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(
        createAddressRoutes({
          addressRepository: mockRepo,
          addressOrderLookup,
        }),
      );

    const response = await app.handle(
      new Request(`http://localhost/addresses/${addressId}`, {
        method: "DELETE",
        headers: { authorization: "Bearer valid-token" },
      }),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "ADDRESS_NOT_FOUND",
        message: "Address not found.",
        details: { addressId },
      },
    });
  });
});
