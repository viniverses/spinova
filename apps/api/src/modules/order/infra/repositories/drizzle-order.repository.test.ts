import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@spinova/database";
import { asDrizzleMock } from "../../../../test-utils/drizzle-mocks.ts";
import { DrizzleOrderRepository } from "./drizzle-order.repository.ts";

vi.mock("@spinova/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@spinova/database")>();
  return {
    ...actual,
    db: {
      select: vi.fn(),
    },
  };
});

describe("DrizzleOrderRepository", () => {
  let repository: DrizzleOrderRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new DrizzleOrderRepository();
  });

  const createMockSelect = (resolvedValue: unknown[]) => {
    const chain = {
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockResolvedValue(resolvedValue),
      then: (onfulfilled?: (value: unknown) => unknown) =>
        Promise.resolve(resolvedValue).then(onfulfilled),
    };
    return chain;
  };

  describe("findById", () => {
    it("returns null when order is not found", async () => {
      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(createMockSelect([])),
      );

      const result = await repository.findById("user-1", "ord-999");
      expect(result).toBeNull();
    });
  });
});
