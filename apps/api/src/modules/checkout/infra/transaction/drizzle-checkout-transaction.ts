import { db } from "@spinova/database";
import type { DatabaseTransaction } from "../../../../database/transaction.ts";
import type { CheckoutTransaction, CheckoutTransactionContext } from "../../application/ports/checkout-transaction.ts";

export type CheckoutContextFactory = (tx: DatabaseTransaction) => CheckoutTransactionContext;

export class DrizzleCheckoutTransaction implements CheckoutTransaction {
  constructor(private readonly createContext: CheckoutContextFactory) {}

  async execute<Result>(operation: (context: CheckoutTransactionContext) => Promise<Result>): Promise<Result> {
    return db.transaction(async (tx) => operation(this.createContext(tx)));
  }
}
