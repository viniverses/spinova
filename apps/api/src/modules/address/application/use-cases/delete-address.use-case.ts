import {
  AddressHasOrdersError,
  AddressNotFoundError,
} from "../../domain/address.errors.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";
import type { AddressOrderLookup } from "../ports/address-order-lookup.interface.ts";

export type DeleteAddressInput = {
  userId: string;
  addressId: string;
};

export class DeleteAddressUseCase {
  constructor(
    private readonly addressRepository: IAddressRepository,
    private readonly addressOrderLookup: AddressOrderLookup,
  ) {}

  async execute(input: DeleteAddressInput): Promise<void> {
    const existing = await this.addressRepository.findById(
      input.userId,
      input.addressId,
    );
    if (!existing) {
      throw new AddressNotFoundError(input.addressId);
    }

    const hasOrders = await this.addressOrderLookup.hasOrdersByAddressId(
      input.addressId,
    );
    if (hasOrders) {
      throw new AddressHasOrdersError(input.addressId);
    }

    await this.addressRepository.delete(input.userId, input.addressId);
  }
}
