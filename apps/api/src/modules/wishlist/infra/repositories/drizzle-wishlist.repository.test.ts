import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@spinova/database";
import { asDrizzleMock } from "../../../../test-utils/drizzle-mocks.ts";
import { DrizzleWishlistRepository } from "./drizzle-wishlist.repository.ts";

vi.mock("@spinova/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@spinova/database")>();
  return {
    ...actual,
    db: {
      select: vi.fn(),
      insert: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe("DrizzleWishlistRepository", () => {
  let repository: DrizzleWishlistRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new DrizzleWishlistRepository();
  });

  const createMockSelect = (resolvedValue: unknown[]) => {
    const chain = {
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(resolvedValue),
      then: (onfulfilled?: (value: unknown) => unknown) =>
        Promise.resolve(resolvedValue).then(onfulfilled),
    };
    return chain;
  };

  describe("findByUserId", () => {
    it("returns wishlist items for user", async () => {
      const now = new Date();
      const mockRows = [
        {
          wishlistId: "wish-1",
          createdAt: now,
          id: "prod-1",
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
          currency: "BRL",
          stockQuantity: 10,
          isImported: false,
          genre: "Rock",
          releaseDate: "1969-09-26",
          imageUrl: null,
          imageBlurDataUrl: null,
          imageWidth: null,
          imageHeight: null,
        },
      ];

      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(createMockSelect(mockRows)),
      );

      const items = await repository.findByUserId("user-1");
      expect(items.length).toBe(1);
      expect(items[0]!.id).toBe("wish-1");
      expect(items[0]!.createdAt).toBe(now.toISOString());
      expect(items[0]!.product.title).toBe("Abbey Road");
    });
  });

  describe("add", () => {
    it("returns product-not-found if product does not exist", async () => {
      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(createMockSelect([])),
      );

      await expect(repository.add("user-1", "prod-none")).resolves.toEqual({
        kind: "product-not-found",
      });
    });

    it("returns duplicate if item is already in wishlist", async () => {
      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(
          createMockSelect([{ id: "prod-1" }]),
        ),
      );

      const insertChain = {
        values: vi.fn().mockReturnThis(),
        onConflictDoNothing: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.insert).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.insert>>(insertChain),
      );

      await expect(repository.add("user-1", "prod-1")).resolves.toEqual({
        kind: "duplicate",
      });
    });

    it("successfully adds item and returns WishlistEntry", async () => {
      const now = new Date();
      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(
          createMockSelect([{ id: "prod-1" }]),
        ),
      );

      const insertChain = {
        values: vi.fn().mockReturnThis(),
        onConflictDoNothing: vi.fn().mockReturnThis(),
        returning: vi
          .fn()
          .mockResolvedValue([
            { id: "wish-1", productId: "prod-1", createdAt: now },
          ]),
      };
      vi.mocked(db.insert).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.insert>>(insertChain),
      );

      const result = await repository.add("user-1", "prod-1");
      expect(result).toEqual({
        kind: "added",
        entry: {
          id: "wish-1",
          productId: "prod-1",
          createdAt: now.toISOString(),
        },
      });
    });
  });

  describe("remove", () => {
    it("returns not-found if item is not found", async () => {
      const deleteChain = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.delete).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.delete>>(deleteChain),
      );

      await expect(repository.remove("user-1", "prod-1")).resolves.toEqual({
        kind: "not-found",
      });
    });

    it("successfully removes item", async () => {
      const deleteChain = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: "wish-1" }]),
      };
      vi.mocked(db.delete).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.delete>>(deleteChain),
      );

      await expect(repository.remove("user-1", "prod-1")).resolves.toEqual({
        kind: "removed",
      });
    });
  });
});
