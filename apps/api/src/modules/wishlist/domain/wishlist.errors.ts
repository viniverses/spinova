import { DomainError } from "../../../shared/errors/domain.ts";

export class ProductNotFoundError extends DomainError {
  public readonly code = "PRODUCT_NOT_FOUND";
  public readonly productId: string;

  constructor(productId: string, message = "Product not found.") {
    super(message, { details: { productId } });
    this.productId = productId;
  }
}

export class WishlistDuplicateError extends DomainError {
  public readonly code = "WISHLIST_DUPLICATE";
  public readonly productId: string;

  constructor(
    productId: string,
    message = "Product is already in your wishlist.",
  ) {
    super(message, { details: { productId } });
    this.productId = productId;
  }
}
export class WishlistEntryNotFoundError extends DomainError {
  public readonly code = "WISHLIST_ENTRY_NOT_FOUND";
  public readonly productId: string;

  constructor(
    productId: string,
    message = "Product not found in your wishlist.",
  ) {
    super(message, { details: { productId } });
    this.productId = productId;
  }
}
