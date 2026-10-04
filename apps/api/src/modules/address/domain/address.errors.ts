import { DomainError } from "../../../shared/errors/domain.ts";

export class AddressNotFoundError extends DomainError {
  public readonly code = "ADDRESS_NOT_FOUND";
  public readonly addressId?: string;

  constructor(addressId?: string, message = "Address not found.") {
    super(message, addressId ? { details: { addressId } } : undefined);
    this.addressId = addressId;
  }
}
export class AddressHasOrdersError extends DomainError {
  public readonly code = "ADDRESS_HAS_ORDERS";
  public readonly addressId: string;

  constructor(
    addressId: string,
    message = "Cannot delete address linked to orders.",
  ) {
    super(message, { details: { addressId } });
    this.addressId = addressId;
  }
}
