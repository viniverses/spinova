import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@spinova/database";
import { asDrizzleMock } from "../../../../test-utils/drizzle-mocks.ts";
import { Cart, CartItemEntity } from "../../domain/entities/index.ts";
import { DrizzleCartRepository } from "./drizzle-cart.repository.ts";

vi.mock("@spinova/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@spinova/database")>();
  return {
    ...actual,
    db: {
      select: vi.fn(),
      transaction: vi.fn(),
    },
  };
});

describe("DrizzleCartRepository", () => {
  let repository: DrizzleCartRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new DrizzleCartRepository();
  });

  const createMockSelect = (resolvedValue: unknown[]) => {
    const chain = {
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(resolvedValue),
      then: (resolve: (value: unknown[]) => unknown) =>
        Promise.resolve(resolvedValue).then(resolve),
    };
    return chain;
  };

  it("returns an empty Cart when the user has no cart", async () => {
    vi.mocked(db.select).mockReturnValue(
      asDrizzleMock<ReturnType<typeof db.select>>(createMockSelect([])),
    );

    const cart = await repository.getCartByUserId("user-no-cart");
    expect(cart.items).toEqual([]);
    expect(cart.id).toBeNull();
  });

  it("hydrates a Cart aggregate with its items", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(
        asDrizzleMock<ReturnType<typeof db.select>>(
          createMockSelect([{ id: "cart-123" }]),
        ),
      )
      .mockReturnValueOnce(
        asDrizzleMock<ReturnType<typeof db.select>>(
          createMockSelect([
            {
              itemId: "item-1",
              quantity: 2,
              productId: "prod-1",
              albumId: "alb-1",
              title: "Abbey Road",
              artistId: "art-1",
              artistName: "The Beatles",
              artistSlug: "the-beatles",
              sku: "BEAT-001",
              format: "vinyl",
              edition: "standard",
              price: "150.00",
              compareAtPrice: null,
              stockQuantity: 10,
              isImported: false,
              genre: "Rock",
              releaseDate: "1969-09-26",
              imageUrl: null,
              imageAltText: null,
            },
          ]),
        ),
      );

    const cart = await repository.getCartByUserId("user-1");
    expect(cart.id).toBe("cart-123");
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.quantity).toBe(2);
    expect(cart.items[0]?.product).toEqual({ id: "prod-1", price: "150.00" });
  });

  it("persists the aggregate state atomically", async () => {
    const deleteChain = {
      where: vi.fn().mockResolvedValue(undefined),
    };
    const insertChain = {
      values: vi.fn().mockResolvedValue(undefined),
    };
    const lockedCartSelect = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      for: vi.fn().mockResolvedValue([{ id: "cart-1" }]),
    };
    const currentItemsSelect = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([
        { id: "item-1", productId: "prod-1", quantity: 2 },
      ]),
    };
    const tx = {
      select: vi
        .fn()
        .mockReturnValueOnce(lockedCartSelect)
        .mockReturnValueOnce(currentItemsSelect),
      delete: vi.fn().mockReturnValue(deleteChain),
      insert: vi.fn().mockReturnValue(insertChain),
    };
    type DrizzleTransaction = Parameters<
      Parameters<typeof db.transaction>[0]
    >[0];
    vi.mocked(db.transaction).mockImplementation(
      async (callback: Parameters<typeof db.transaction>[0]) =>
        callback(asDrizzleMock<DrizzleTransaction>(tx)),
    );

    const product = {
      id: "prod-1",
      albumId: "album-1",
      title: "OK Computer",
      artist: { id: "artist-1", name: "Radiohead", slug: "radiohead" },
      sku: "SKU-1",
      format: "vinyl" as const,
      edition: "standard" as const,
      price: "150.00",
      compareAtPrice: null,
      currency: "BRL" as const,
      stockQuantity: 10,
      inStock: true,
      isImported: false,
      genre: "Alternative Rock",
      releaseDate: "1997-05-21",
      image: null,
    };

    const cart = new Cart("cart-1", [new CartItemEntity("item-1", 2, product)]);
    await repository.save("user-1", cart, cart.clone());

    expect(db.transaction).toHaveBeenCalledTimes(1);
    expect(tx.delete).toHaveBeenCalled();
    expect(tx.insert).toHaveBeenCalled();
    expect(insertChain.values).toHaveBeenCalledWith([
      {
        id: "item-1",
        cartId: "cart-1",
        productId: "prod-1",
        quantity: 2,
      },
    ]);
  });
});
