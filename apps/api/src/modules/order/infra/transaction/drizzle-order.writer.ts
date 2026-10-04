import { orderItems, orders } from "@spinova/database";
import { RepositoryError } from "../../../../database/errors/repository.ts";
import { assertOrderDraft } from "../../domain/order-draft.ts";
import type { OrderWriter, CreateCheckoutOrderInput, PersistedCheckoutOrder } from "../../application/ports/order-writer.interface.ts";
import type { DatabaseTransaction } from "../../../../database/transaction.ts";

export class DrizzleOrderWriter implements OrderWriter {
  constructor(private readonly tx: DatabaseTransaction) {}

  async createOrder(
    input: CreateCheckoutOrderInput,
  ): Promise<PersistedCheckoutOrder> {
    assertOrderDraft(input);
    const [order] = await this.tx
      .insert(orders)
      .values({
        userId: input.userId,
        addressId: input.address.id,
        total: input.total,
        addressSnapshot: input.address,
      })
      .returning({
        id: orders.id,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
      });

    if (!order) throw new RepositoryError("insert", "orders");

    await this.tx.insert(orderItems).values(
      input.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productSnapshot: item.product,
      })),
    );

    return order;
  }
}
