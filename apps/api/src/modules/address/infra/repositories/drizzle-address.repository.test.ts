import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@spinova/database";
import { RepositoryError } from "../../../../database/errors/repository.ts";
import { asDrizzleMock } from "../../../../test-utils/drizzle-mocks.ts";
import { DrizzleAddressRepository } from "./drizzle-address.repository.ts";

vi.mock("@spinova/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@spinova/database")>();
  return {
    ...actual,
    db: {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      transaction: vi.fn(),
    },
  };
});

type TransactionCallback = Parameters<typeof db.transaction>[0];
type TransactionClient = TransactionCallback extends (
  tx: infer Transaction,
) => unknown
  ? Transaction
  : never;

describe("DrizzleAddressRepository", () => {
  let repository: DrizzleAddressRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new DrizzleAddressRepository();
  });

  const createMockSelect = (resolvedValue: unknown[]) => {
    const chain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(resolvedValue),
      then: (onfulfilled?: (value: unknown) => unknown) =>
        Promise.resolve(resolvedValue).then(onfulfilled),
    };
    return chain;
  };

  describe("findById", () => {
    it("returns address when found", async () => {
      const mockAddress = {
        id: "addr-1",
        userId: "user-1",
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
      };

      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(
          createMockSelect([mockAddress]),
        ),
      );

      const result = await repository.findById("user-1", "addr-1");
      expect(result).toEqual(mockAddress);
      expect(db.select).toHaveBeenCalled();
    });

    it("returns null when address is not found", async () => {
      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(createMockSelect([])),
      );

      const result = await repository.findById("user-1", "non-existent");
      expect(result).toBeNull();
    });
  });

  describe("findByUserId", () => {
    it("returns list of addresses for user", async () => {
      const mockList = [
        { id: "addr-1", userId: "user-1", label: "Casa" },
        { id: "addr-2", userId: "user-1", label: "Trabalho" },
      ];

      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(createMockSelect(mockList)),
      );

      const result = await repository.findByUserId("user-1");
      expect(result).toEqual(mockList);
    });
  });

  describe("findDefaultByUserId", () => {
    it("returns default address when found", async () => {
      const mockDefault = { id: "addr-1", userId: "user-1", isDefault: true };

      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(
          createMockSelect([mockDefault]),
        ),
      );

      const result = await repository.findDefaultByUserId("user-1");
      expect(result).toEqual(mockDefault);
    });

    it("returns null when no default address found", async () => {
      vi.mocked(db.select).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.select>>(createMockSelect([])),
      );

      const result = await repository.findDefaultByUserId("user-1");
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    const createMockInsert = (result: unknown[]) => ({
      values: vi.fn().mockReturnThis(),
      onConflictDoNothing: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue(result),
    });

    it("creates the first address as default atomically", async () => {
      const newAddr = {
        id: "addr-new",
        userId: "user-1",
        label: "Casa",
        street: "Rua 1",
        number: "10",
        complement: null,
        neighborhood: null,
        city: "SP",
        state: "SP",
        zipCode: "01001-000",
        country: "BR",
        isDefault: true,
      };

      const firstInsert = createMockInsert([newAddr]);
      const mockTx = {
        insert: vi.fn().mockReturnValue(firstInsert),
      };

      vi.mocked(db.transaction).mockImplementation(
        async (cb: TransactionCallback) =>
          cb(asDrizzleMock<TransactionClient>(mockTx)),
      );

      const result = await repository.create("user-1", {
        label: "Casa",
        street: "Rua 1",
        number: "10",
        city: "SP",
        state: "SP",
        zipCode: "01001-000",
      });

      expect(result).toEqual(newAddr);
      expect(mockTx.insert).toHaveBeenCalled();
      expect(firstInsert.onConflictDoNothing).toHaveBeenCalled();
    });

    it("falls back to a non-default address when another request wins", async () => {
      const newAddress = {
        id: "addr-new",
        userId: "user-1",
        label: "Trabalho",
        street: "Rua 2",
        number: "20",
        complement: null,
        neighborhood: null,
        city: "SP",
        state: "SP",
        zipCode: "01002-000",
        country: "BR",
        isDefault: false,
      };
      const firstInsert = createMockInsert([]);
      const secondInsert = createMockInsert([newAddress]);
      const mockTx = {
        insert: vi
          .fn()
          .mockReturnValueOnce(firstInsert)
          .mockReturnValueOnce(secondInsert),
      };

      vi.mocked(db.transaction).mockImplementation(
        async (cb: TransactionCallback) =>
          cb(asDrizzleMock<TransactionClient>(mockTx)),
      );

      const result = await repository.create("user-1", {
        label: "Trabalho",
        street: "Rua 2",
        number: "20",
        city: "SP",
        state: "SP",
        zipCode: "01002-000",
      });

      expect(result).toEqual(newAddress);
      expect(secondInsert.values).toHaveBeenCalledWith(
        expect.objectContaining({ isDefault: false }),
      );
    });

    it("throws RepositoryError if returning is empty", async () => {
      const mockTx = {
        insert: vi
          .fn()
          .mockReturnValueOnce(createMockInsert([]))
          .mockReturnValueOnce(createMockInsert([])),
      };

      vi.mocked(db.transaction).mockImplementation(
        async (cb: TransactionCallback) =>
          cb(asDrizzleMock<TransactionClient>(mockTx)),
      );

      await expect(
        repository.create("user-1", {
          label: "Casa",
          street: "Rua 1",
          number: "10",
          city: "SP",
          state: "SP",
          zipCode: "01001-000",
        }),
      ).rejects.toThrow(RepositoryError);
    });
  });

  describe("delete", () => {
    it("executes db.delete", async () => {
      const mockDeleteChain = {
        where: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(db.delete).mockReturnValue(
        asDrizzleMock<ReturnType<typeof db.delete>>(mockDeleteChain),
      );

      await repository.delete("user-1", "addr-1");
      expect(db.delete).toHaveBeenCalled();
      expect(mockDeleteChain.where).toHaveBeenCalled();
    });
  });
});
