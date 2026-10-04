import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@spinova/database";
import { asDrizzleMock } from "../../../../test-utils/drizzle-mocks.ts";
import { DrizzleAddressOrderLookup } from "./drizzle-address-order.lookup.ts";

vi.mock("@spinova/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@spinova/database")>();
  return {
    ...actual,
    db: {
      select: vi.fn(),
    },
  };
});

describe("DrizzleAddressOrderLookup", () => {
  let lookup: DrizzleAddressOrderLookup;

  beforeEach(() => {
    vi.clearAllMocks();
    lookup = new DrizzleAddressOrderLookup();
  });

  const createMockSelect = (resolvedValue: unknown[]) => ({
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(resolvedValue),
  });

  it("returns true when an order uses the address", async () => {
    vi.mocked(db.select).mockReturnValue(
      asDrizzleMock<ReturnType<typeof db.select>>(
        createMockSelect([{ id: "ord-1" }]),
      ),
    );

    await expect(lookup.hasOrdersByAddressId("addr-1")).resolves.toBe(true);
  });

  it("returns false when no order uses the address", async () => {
    vi.mocked(db.select).mockReturnValue(
      asDrizzleMock<ReturnType<typeof db.select>>(createMockSelect([])),
    );

    await expect(lookup.hasOrdersByAddressId("addr-2")).resolves.toBe(false);
  });
});
