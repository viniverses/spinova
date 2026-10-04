import { InvalidOrderItemError } from "../order.errors.ts";
import type { OrderProductSnapshot } from "../../../../shared/contracts/order-snapshot.ts";
import type { Money } from "../../../../shared/value-objects/money.ts";

export type ProductFormat = OrderProductSnapshot["format"];
export type OrderItemProductData = OrderProductSnapshot;

export interface OrderItemProps {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: Money;
  product?: OrderItemProductData;
}

export class OrderItem {
  public readonly id: string;
  public readonly orderId: string;
  public readonly productId: string;
  public readonly quantity: number;
  public readonly unitPrice: Money;
  public readonly product?: OrderItemProductData;

  constructor(props: OrderItemProps) {
    if (!props.id) {
      throw new InvalidOrderItemError("OrderItem ID is required.");
    }
    if (!props.productId) {
      throw new InvalidOrderItemError("OrderItem productId is required.");
    }
    if (!props.orderId) {
      throw new InvalidOrderItemError("OrderItem orderId is required.");
    }
    if (!Number.isInteger(props.quantity) || props.quantity < 1) {
      throw new InvalidOrderItemError(
        "OrderItem quantity must be a positive integer.",
        { quantity: props.quantity },
      );
    }
    if (props.unitPrice.isNegative) {
      throw new InvalidOrderItemError(
        "OrderItem unitPrice must be a valid non-negative number.",
        { unitPrice: props.unitPrice.toDecimal() },
      );
    }

    this.id = props.id;
    this.orderId = props.orderId;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.product = props.product;
  }

  public get subtotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  public get subtotalInCents(): number {
    return this.subtotal.cents;
  }
}
