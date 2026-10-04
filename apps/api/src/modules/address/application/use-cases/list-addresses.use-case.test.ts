import { describe, expect, it, vi } from "vitest";

import type { Address } from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";
import { ListAddressesUseCase } from "./list-addresses.use-case.ts";

describe("ListAddressesUseCase", () => {
  it("returns all addresses for the user", async () => {
    const mockAddresses: Address[] = [
      {
        id: "addr-1",
        label: "Casa",
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 101",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "01001-000",
        country: "BR",
        isDefault: true,
      },
    ];

    const mockRepo: IAddressRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn().mockResolvedValue(mockAddresses),
      findDefaultByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new ListAddressesUseCase(mockRepo);
    const result = await useCase.execute({ userId: "user-123" });

    expect(mockRepo.findByUserId).toHaveBeenCalledWith("user-123");
    expect(result).toEqual(mockAddresses);
  });
});
