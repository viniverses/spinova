import { addresses, db, orders } from "@spinova/database";
import { and, asc, desc, eq } from "@spinova/database/query";
import { RepositoryError } from "../../errors/index.ts";

export async function getAddressesByUserId(userId: string) {
  try {
    return await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(desc(addresses.isDefault), asc(addresses.id));
  } catch (error) {
    throw new RepositoryError("list", "addresses", error);
  }
}

export async function getDefaultAddress(userId: string) {
  try {
    const address = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)))
      .limit(1);

    if (address.length > 0) {
      return address[0];
    }

    const firstAddress = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(asc(addresses.id))
      .limit(1);

    return firstAddress.length > 0 ? firstAddress[0] : null;
  } catch (error) {
    throw new RepositoryError("get", "addresses", error);
  }
}

export async function createAddress(
  userId: string,
  data: {
    label: string;
    street: string;
    number: string;
    complement?: string | null;
    neighborhood?: string | null;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  }
) {
  try {
    return await db.transaction(async (tx) => {
      const existingAddresses = await tx
        .select({ id: addresses.id })
        .from(addresses)
        .where(eq(addresses.userId, userId))
        .limit(1);

      const isDefault = existingAddresses.length === 0;

      const [newAddress] = await tx
        .insert(addresses)
        .values({
          userId,
          label: data.label,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country ?? "BR",
          isDefault,
        })
        .returning();

      if (!newAddress) {
        throw new Error("Address could not be created.");
      }

      return newAddress;
    });
  } catch (error) {
    throw new RepositoryError("insert", "addresses", error);
  }
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: Partial<{
    label: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>
) {
  try {
    return await db.transaction(async (tx) => {
      const existingAddress = await tx
        .select()
        .from(addresses)
        .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
        .limit(1);

      if (existingAddress.length === 0) {
        return { status: "not-found" } as const;
      }

      const [updatedAddress] = await tx
        .update(addresses)
        .set({
          label: data.label,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        })
        .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
        .returning();

      if (!updatedAddress) {
        return { status: "not-found" } as const;
      }

      return { status: "updated", data: updatedAddress } as const;
    });
  } catch (error) {
    throw new RepositoryError("update", "addresses", error);
  }
}

export async function deleteAddress(userId: string, addressId: string) {
  try {
    const existingAddress = await db
      .select({ id: addresses.id })
      .from(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
      .limit(1);

    if (existingAddress.length === 0) {
      return { status: "not-found" } as const;
    }

    const [orderWithAddress] = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.addressId, addressId))
      .limit(1);

    if (orderWithAddress) {
      return { status: "has-orders" } as const;
    }

    await db
      .delete(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));

    return { status: "deleted" } as const;
  } catch (error) {
    throw new RepositoryError("delete", "addresses", error);
  }
}
