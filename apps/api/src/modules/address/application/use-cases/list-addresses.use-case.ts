import type { Address } from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";

export type ListAddressesInput = {
  userId: string;
};

export class ListAddressesUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(input: ListAddressesInput): Promise<Address[]> {
    return this.addressRepository.findByUserId(input.userId);
  }
}
