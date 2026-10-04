import { InvalidOrderError } from "../order.errors.ts";
import { OrderItem } from "./order-item.entity.ts";
import type { OrderAddressSnapshot } from "../../../../shared/contracts/order-snapshot.ts";
import type { Money } from "../../../../shared/value-objects/money.ts";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

const ORDER_STATUSES: readonly OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export type OrderAddressData = OrderAddressSnapshot;

export interface OrderProps {
  id: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  total: Money;
  currency?: "BRL";
  createdAt?: Date;
  items?: OrderItem[];
  address?: OrderAddressData;
}

export class Order {
  public readonly id: string;
  public readonly userId: string;
  public readonly addressId: string;
  private readonly _status: OrderStatus;
  public readonly total: Money;
  public readonly currency: "BRL";
  public readonly createdAt: Date;
  private readonly _items: OrderItem[];
  public readonly address?: OrderAddressData;

  constructor(props: OrderProps) {
    if (!props.id) throw new InvalidOrderError("Order ID is required.");
    if (!props.userId) {
      throw new InvalidOrderError("Order userId is required.");
    }
    if (!props.addressId) {
      throw new InvalidOrderError("Order addressId is required.");
    }
    if (!ORDER_STATUSES.includes(props.status)) {
      throw new InvalidOrderError("Order status is invalid.", {
        status: props.status,
      });
    }

    if (props.total.isNegative) {
      throw new InvalidOrderError(
        "Order total must be a valid non-negative number.",
        { total: props.total.toDecimal() },
      );
    }

    this.id = props.id;
    this.userId = props.userId;
    this.addressId = props.addressId;
    this._status = props.status;
    this.total = props.total;
    this.currency = props.currency ?? "BRL";
    this.createdAt = props.createdAt ?? new Date();
    this._items = props.items ? [...props.items] : [];
    this.address = props.address;
  }

  public get status(): OrderStatus {
    return this._status;
  }

  public get items(): readonly OrderItem[] {
    return [...this._items];
  }

  public get itemsCount(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }

}
