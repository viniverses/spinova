import { DomainError } from "../../../shared/errors/domain.ts";

export class CartEmptyError extends DomainError {
  public readonly code = "CART_EMPTY";

  constructor(message = "The cart has no items to checkout.") {
    super(message);
  }
}

export class DeliveryAddressRequiredError extends DomainError {
  public readonly code = "DELIVERY_ADDRESS_REQUIRED";

  constructor(message = "A delivery address is required to checkout.") {
    super(message);
  }
}

export class InsufficientStockError extends DomainError {
  public readonly code = "INSUFFICIENT_STOCK";
  public readonly productId: string;

  constructor(
    productId: string,
    message = "The requested quantity is not available.",
  ) {
    super(message, { details: { productId } });
    this.productId = productId;
  }
}
