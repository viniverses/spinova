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

export type ProductFilterErrorCode =
  | "EMPTY_SEARCH"
  | "INVALID_PRICE_RANGE"
  | "CONFLICTING_FILTERS";

export class InvalidProductFilterError extends DomainError {
  public readonly code: ProductFilterErrorCode;

  constructor(
    code: ProductFilterErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message, { details });
    this.code = code;
  }
}
