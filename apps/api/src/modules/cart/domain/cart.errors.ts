import { DomainError } from "../../../shared/errors/domain.ts";

export class ProductNotFoundError extends DomainError {
  public readonly code = "PRODUCT_NOT_FOUND";
  public readonly productId: string;

  constructor(productId: string, message = "Product not found.") {
    super(message, { details: { productId } });
    this.productId = productId;
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

export class CartItemNotFoundError extends DomainError {
  public readonly code = "CART_ITEM_NOT_FOUND";
  public readonly productId: string;

  constructor(productId: string, message = "Product not found in cart.") {
    super(message, { details: { productId } });
    this.productId = productId;
  }
}

export class InvalidCartError extends DomainError {
  public readonly code = "INVALID_CART";

  constructor(message: string, details?: unknown) {
    super(message, { details });
  }
}

export class InvalidCartQuantityError extends DomainError {
  public readonly code = "INVALID_CART_QUANTITY";

  constructor(quantity: number) {
    super("Cart item quantity must be a whole number between 1 and 99.", {
      details: { quantity },
    });
  }
}

export class ConcurrentCartUpdateError extends DomainError {
  public readonly code = "CART_CONCURRENT_UPDATE";

  constructor(message = "The cart changed while it was being updated.") {
    super(message);
  }
}
