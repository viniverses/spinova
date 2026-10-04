import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@spinova/database";
import { asDrizzleMock } from "../../../../test-utils/drizzle-mocks.ts";
import { DrizzleProductStockReader } from "./drizzle-product-stock.reader.ts";

vi.mock("@spinova/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@spinova/database")>();
  return {
    ...actual,
    db: {
      select: vi.fn(),
    },
  };
});

describe("DrizzleProductStockReader", () => {
  let reader: DrizzleProductStockReader;

  beforeEach(() => {
    vi.clearAllMocks();
    reader = new DrizzleProductStockReader();
  });

  const createMockSelect = (resolvedValue: unknown[]) => ({
    from: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(resolvedValue),
  });

  it("returns stock quantity when product exists", async () => {
    vi.mocked(db.select).mockReturnValue(
      asDrizzleMock<ReturnType<typeof db.select>>(
        createMockSelect([
          {
            id: "prod-1",
            albumId: "album-1",
            title: "OK Computer",
            artistId: "artist-1",
            artistName: "Radiohead",
            artistSlug: "radiohead",
            sku: "SKU-1",
            format: "vinyl",
            edition: "standard",
            price: "150.00",
            compareAtPrice: null,
            stockQuantity: 25,
            isImported: false,
            genre: "Alternative Rock",
            releaseDate: "1997-05-21",
            imageUrl: null,
            imageAltText: null,
          },
        ]),
      ),
    );

    await expect(reader.getProductStock("prod-1")).resolves.toMatchObject({
      stockQuantity: 25,
      product: { id: "prod-1", price: "150.00" },
    });
  });

  it("returns null when product does not exist", async () => {
    vi.mocked(db.select).mockReturnValue(
      asDrizzleMock<ReturnType<typeof db.select>>(createMockSelect([])),
    );

    await expect(reader.getProductStock("prod-none")).resolves.toBeNull();
  });
});
