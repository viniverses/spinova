import { AddressNotFoundError } from "../../domain/address.errors.ts";
import type { Address } from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";

export type GetDefaultAddressInput = {
  userId: string;
};

export class GetDefaultAddressUseCase {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(input: GetDefaultAddressInput): Promise<Address> {
    const address = await this.addressRepository.findDefaultByUserId(
      input.userId,
    );
    if (!address) {
      throw new AddressNotFoundError(undefined, "Default address not found.");
    }
    return address;
  }
}
