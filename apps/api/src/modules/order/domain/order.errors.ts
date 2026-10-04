import { DomainError } from "../../../shared/errors/domain.ts";

export class OrderNotFoundError extends DomainError {
  public readonly code = "ORDER_NOT_FOUND";
  public readonly orderId: string;

  constructor(orderId: string, message = "Order not found.") {
    super(message, { details: { orderId } });
    this.orderId = orderId;
  }
}

export class InvalidOrderError extends DomainError {
  public readonly code = "INVALID_ORDER";

  constructor(message: string, details?: unknown) {
    super(message, { details });
  }
}

export class InvalidOrderItemError extends DomainError {
  public readonly code = "INVALID_ORDER_ITEM";

  constructor(message: string, details?: unknown) {
    super(message, { details });
  }
}
