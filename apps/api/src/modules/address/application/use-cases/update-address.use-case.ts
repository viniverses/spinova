import { AddressNotFoundError } from "../../domain/address.errors.ts";
import type { Address, UpdateAddressData } from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";

export type UpdateAddressInput = {
  userId: string;
  addressId: string;
  data: UpdateAddressData;
};

export class UpdateAddressUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(input: UpdateAddressInput): Promise<Address> {
    const existing = await this.addressRepository.findById(
      input.userId,
      input.addressId,
    );
    if (!existing) {
      throw new AddressNotFoundError(input.addressId);
    }

    return this.addressRepository.update(
      input.userId,
      input.addressId,
      input.data,
    );
  }
}
