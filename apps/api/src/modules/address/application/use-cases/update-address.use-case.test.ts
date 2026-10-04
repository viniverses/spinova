import { describe, expect, it, vi } from "vitest";

import { AddressNotFoundError } from "../../domain/address.errors.ts";
import type { Address, UpdateAddressData } from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";
import { UpdateAddressUseCase } from "./update-address.use-case.ts";

const mockExistingAddress: Address = {
  id: "addr-1",
  label: "Casa Antiga",
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

describe("UpdateAddressUseCase", () => {
  it("updates and returns updated address when address exists", async () => {
    const updateData: UpdateAddressData = {
      label: "Novo Label",
    };

    const mockUpdatedAddress: Address = {
      ...mockExistingAddress,
      label: "Novo Label",
    };

    const mockRepo: IAddressRepository = {
      findById: vi.fn().mockResolvedValue(mockExistingAddress),
      findByUserId: vi.fn(),
      findDefaultByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue(mockUpdatedAddress),
      delete: vi.fn(),
    };

    const useCase = new UpdateAddressUseCase(mockRepo);
    const result = await useCase.execute({
      userId: "user-123",
      addressId: "addr-1",
      data: updateData,
    });

    expect(mockRepo.findById).toHaveBeenCalledWith("user-123", "addr-1");
    expect(mockRepo.update).toHaveBeenCalledWith(
      "user-123",
      "addr-1",
      updateData,
    );
    expect(result).toEqual(mockUpdatedAddress);
  });

  it("throws AddressNotFoundError when address does not exist", async () => {
    const mockRepo: IAddressRepository = {
      findById: vi.fn().mockResolvedValue(null),
      findByUserId: vi.fn(),
      findDefaultByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new UpdateAddressUseCase(mockRepo);
    await expect(
      useCase.execute({
        userId: "user-123",
        addressId: "addr-not-found",
        data: { label: "Novo" },
      }),
    ).rejects.toThrow(AddressNotFoundError);

    expect(mockRepo.update).not.toHaveBeenCalled();
  });
});
