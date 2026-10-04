import { addresses, db } from "@spinova/database";
import { and, asc, desc, eq, sql } from "@spinova/database/query";

import type {
  Address,
  CreateAddressData,
  UpdateAddressData,
} from "../../domain/address.types.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";
import { RepositoryError } from "../../../../database/errors/repository.ts";

type DatabaseTransaction = Parameters<typeof db.transaction>[0] extends (
  tx: infer Transaction,
) => unknown
  ? Transaction
  : never;

export class DrizzleAddressRepository implements IAddressRepository {
  async findById(userId: string, addressId: string): Promise<Address | null> {
    const [address] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
      .limit(1);

    return address ?? null;
  }

  async findByUserId(userId: string): Promise<Address[]> {
    return db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(desc(addresses.isDefault), asc(addresses.id));
  }

  async findDefaultByUserId(userId: string): Promise<Address | null> {
    const [address] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)))
      .limit(1);

    return address ?? null;
  }

  async create(userId: string, data: CreateAddressData): Promise<Address> {
    return db.transaction(async (tx: DatabaseTransaction) => {
      const values = {
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
      };

      let [newAddress] = await tx
        .insert(addresses)
        .values({ ...values, isDefault: true })
        .onConflictDoNothing({
          target: addresses.userId,
          where: sql`${addresses.isDefault} = true`,
        })
        .returning();

      if (!newAddress) {
        [newAddress] = await tx
          .insert(addresses)
          .values({ ...values, isDefault: false })
          .returning();
      }

      if (!newAddress) {
        throw new RepositoryError("insert", "addresses");
      }

      return newAddress;
    });
  }

  async update(
    userId: string,
    addressId: string,
    data: UpdateAddressData,
  ): Promise<Address> {
    const [updatedAddress] = await db
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
      throw new RepositoryError("update", "addresses");
    }

    return updatedAddress;
  }

  async delete(userId: string, addressId: string): Promise<void> {
    await db
      .delete(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
  }
}
