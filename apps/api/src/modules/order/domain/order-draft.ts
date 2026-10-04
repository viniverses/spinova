import type {
  OrderAddressSnapshot,
  OrderProductSnapshot,
} from "../../../shared/contracts/order-snapshot.ts";
import { Money } from "../../../shared/value-objects/money.ts";
import { InvalidOrderError, InvalidOrderItemError } from "./order.errors.ts";

export interface OrderDraftProps {
  userId: string;
  total: string;
  address: OrderAddressSnapshot;
  items: readonly {
    productId: string;
    quantity: number;
    unitPrice: string;
    product: OrderProductSnapshot;
  }[];
}

export const assertOrderDraft = (draft: OrderDraftProps): void => {
  if (!draft.userId || !draft.address.id || draft.items.length === 0) {
    throw new InvalidOrderError(
      "An order requires a user, delivery address, and items.",
    );
  }
  if (Money.fromDecimal(draft.total).isNegative) {
    throw new InvalidOrderError("Order total must be non-negative.");
  }
  const productIds = new Set<string>();
  for (const item of draft.items) {
    if (
      !item.productId ||
      item.product.id !== item.productId ||
      productIds.has(item.productId)
    ) {
      throw new InvalidOrderItemError(
        "Order item product identity must be unique and match its snapshot.",
      );
    }
    if (
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      Money.fromDecimal(item.unitPrice).isNegative
    ) {
      throw new InvalidOrderItemError(
        "Order item requires a positive quantity and non-negative price.",
      );
    }
    productIds.add(item.productId);
  }
};
