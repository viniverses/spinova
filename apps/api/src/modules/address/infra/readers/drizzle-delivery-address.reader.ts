import { addresses } from "@spinova/database";
import { asc, desc, eq } from "@spinova/database/query";
import type { OrderAddressSnapshot } from "../../../../shared/contracts/order-snapshot.ts";
import type { DeliveryAddressReader } from "../../application/ports/delivery-address-reader.interface.ts";
import type { DatabaseTransaction } from "../../../../database/transaction.ts";

export class DrizzleDeliveryAddressReader implements DeliveryAddressReader {
  constructor(private readonly tx: DatabaseTransaction) {}

  async getDeliveryAddress(
    userId: string,
  ): Promise<OrderAddressSnapshot | null> {
    const [address] = await this.tx
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(desc(addresses.isDefault), asc(addresses.id))
      .limit(1);

    if (!address) return null;

    return {
      id: address.id,
      label: address.label,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    };
  }
}
