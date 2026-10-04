import type { Address, CreateAddressData } from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";

export type CreateAddressInput = {
  userId: string;
  data: CreateAddressData;
};

export class CreateAddressUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(input: CreateAddressInput): Promise<Address> {
    return this.addressRepository.create(input.userId, input.data);
  }
}
