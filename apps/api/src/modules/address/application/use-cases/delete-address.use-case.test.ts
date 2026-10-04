import { describe, expect, it, vi } from "vitest";

import {
  AddressHasOrdersError,
  AddressNotFoundError,
} from "../../domain/address.errors.ts";
import type { Address } from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";
import type { AddressOrderLookup } from "../ports/address-order-lookup.interface.ts";
import { DeleteAddressUseCase } from "./delete-address.use-case.ts";

const mockAddress: Address = {
  id: "addr-1",
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

describe("DeleteAddressUseCase", () => {
  it("deletes address successfully when it exists and has no orders", async () => {
    const mockRepo: IAddressRepository = {
      findById: vi.fn().mockResolvedValue(mockAddress),
      findByUserId: vi.fn(),
      findDefaultByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    const addressOrderLookup: AddressOrderLookup = {
      hasOrdersByAddressId: vi.fn().mockResolvedValue(false),
    };

    const useCase = new DeleteAddressUseCase(mockRepo, addressOrderLookup);
    await useCase.execute({ userId: "user-123", addressId: "addr-1" });

    expect(mockRepo.findById).toHaveBeenCalledWith("user-123", "addr-1");
    expect(addressOrderLookup.hasOrdersByAddressId).toHaveBeenCalledWith(
      "addr-1",
    );
    expect(mockRepo.delete).toHaveBeenCalledWith("user-123", "addr-1");
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
    const addressOrderLookup: AddressOrderLookup = {
      hasOrdersByAddressId: vi.fn(),
    };

    const useCase = new DeleteAddressUseCase(mockRepo, addressOrderLookup);
    await expect(
      useCase.execute({ userId: "user-123", addressId: "addr-not-found" }),
    ).rejects.toThrow(AddressNotFoundError);

    expect(addressOrderLookup.hasOrdersByAddressId).not.toHaveBeenCalled();
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it("throws AddressHasOrdersError when address is linked to orders", async () => {
    const mockRepo: IAddressRepository = {
      findById: vi.fn().mockResolvedValue(mockAddress),
      findByUserId: vi.fn(),
      findDefaultByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    const addressOrderLookup: AddressOrderLookup = {
      hasOrdersByAddressId: vi.fn().mockResolvedValue(true),
    };

    const useCase = new DeleteAddressUseCase(mockRepo, addressOrderLookup);
    await expect(
      useCase.execute({ userId: "user-123", addressId: "addr-1" }),
    ).rejects.toThrow(AddressHasOrdersError);

    expect(addressOrderLookup.hasOrdersByAddressId).toHaveBeenCalledWith(
      "addr-1",
    );
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
