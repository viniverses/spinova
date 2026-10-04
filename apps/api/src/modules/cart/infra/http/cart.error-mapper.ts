import { createDomainErrorMapper } from "../../../../http/plugins/domain-error-mapper.ts";
import {
  CartItemNotFoundError,
  ConcurrentCartUpdateError,
  InsufficientStockError,
  InvalidCartError,
  InvalidCartQuantityError,
  ProductNotFoundError,
} from "../../domain/cart.errors.ts";

export const cartErrorMapper = createDomainErrorMapper("cart-error-mapper", [
  { errorType: ProductNotFoundError, status: 404 },
  { errorType: InsufficientStockError, status: 409 },
  { errorType: CartItemNotFoundError, status: 404 },
  { errorType: InvalidCartError, status: 400 },
  { errorType: InvalidCartQuantityError, status: 400 },
  { errorType: ConcurrentCartUpdateError, status: 409 },
]);
