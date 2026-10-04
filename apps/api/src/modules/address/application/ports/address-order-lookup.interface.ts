export interface AddressOrderLookup {
  hasOrdersByAddressId(addressId: string): Promise<boolean>;
}
