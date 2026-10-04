import { db, orders } from "@spinova/database";
import { eq } from "@spinova/database/query";

import type { AddressOrderLookup } from "../../application/ports/address-order-lookup.interface.ts";

export class DrizzleAddressOrderLookup implements AddressOrderLookup {
  async hasOrdersByAddressId(addressId: string): Promise<boolean> {
    const [order] = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.addressId, addressId))
      .limit(1);

    return Boolean(order);
  }
}
