import { createDomainErrorMapper } from "../../../../http/plugins/domain-error-mapper.ts";
import {
  InsufficientStockError,
  InvalidProductFilterError,
  ProductNotFoundError,
} from "../../domain/product.errors.ts";

export const productErrorMapper = createDomainErrorMapper(
  "product-error-mapper",
  [
    { errorType: ProductNotFoundError, status: 404 },
    { errorType: InsufficientStockError, status: 409 },
    { errorType: InvalidProductFilterError, status: 400 },
  ],
);
