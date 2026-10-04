import type {
  Address,
  CreateAddressData,
  UpdateAddressData,
} from "../address.types.ts";

export interface IAddressRepository {
  findById(userId: string, addressId: string): Promise<Address | null>;
  findByUserId(userId: string): Promise<Address[]>;
  findDefaultByUserId(userId: string): Promise<Address | null>;
  create(userId: string, data: CreateAddressData): Promise<Address>;
  update(
    userId: string,
    addressId: string,
    data: UpdateAddressData,
  ): Promise<Address>;
  delete(userId: string, addressId: string): Promise<void>;
}
