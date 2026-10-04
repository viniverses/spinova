import { describe, expect, it, vi } from "vitest";

import type { Address, CreateAddressData } from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";
import { CreateAddressUseCase } from "./create-address.use-case.ts";

describe("CreateAddressUseCase", () => {
  it("creates and returns a new address", async () => {
    const inputDto: CreateAddressData = {
      label: "Trabalho",
      street: "Av. Paulista",
      number: "1000",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
    };

    const mockCreatedAddress: Address = {
      id: "addr-2",
      label: inputDto.label,
      street: inputDto.street,
      number: inputDto.number,
      complement: null,
      neighborhood: null,
      city: inputDto.city,
      state: inputDto.state,
      zipCode: inputDto.zipCode,
      country: "BR",
      isDefault: true,
    };

    const mockRepo: IAddressRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findDefaultByUserId: vi.fn(),
      create: vi.fn().mockResolvedValue(mockCreatedAddress),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new CreateAddressUseCase(mockRepo);
    const result = await useCase.execute({
      userId: "user-123",
      data: inputDto,
    });

    expect(mockRepo.create).toHaveBeenCalledWith("user-123", inputDto);
    expect(result).toEqual(mockCreatedAddress);
  });
});
