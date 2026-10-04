import { describe, expect, it, vi } from "vitest";

import { AddressNotFoundError } from "../../domain/address.errors.ts";
import type { Address } from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";
import { GetDefaultAddressUseCase } from "./get-default-address.use-case.ts";

describe("GetDefaultAddressUseCase", () => {
  it("returns default address when found", async () => {
    const mockAddress: Address = {
      id: "addr-1",
      label: "Casa",
      street: "Rua das Flores",
      number: "123",
      complement: null,
      neighborhood: null,
      city: "São Paulo",
      state: "SP",
      zipCode: "01001-000",
      country: "BR",
      isDefault: true,
    };

    const mockRepo: IAddressRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findDefaultByUserId: vi.fn().mockResolvedValue(mockAddress),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new GetDefaultAddressUseCase(mockRepo);
    const result = await useCase.execute({ userId: "user-123" });

    expect(mockRepo.findDefaultByUserId).toHaveBeenCalledWith("user-123");
    expect(result).toEqual(mockAddress);
  });

  it("throws AddressNotFoundError when no default address exists", async () => {
    const mockRepo: IAddressRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findDefaultByUserId: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new GetDefaultAddressUseCase(mockRepo);
    await expect(useCase.execute({ userId: "user-123" })).rejects.toThrow(
      AddressNotFoundError,
    );
  });
});
