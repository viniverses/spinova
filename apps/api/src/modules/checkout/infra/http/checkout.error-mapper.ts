import { createDomainErrorMapper } from "../../../../http/plugins/domain-error-mapper.ts";
import {
  CartEmptyError,
  DeliveryAddressRequiredError,
  InsufficientStockError,
} from "../../domain/checkout.errors.ts";

export const checkoutErrorMapper = createDomainErrorMapper(
  "checkout-error-mapper",
  [
    { errorType: CartEmptyError, status: 400 },
    { errorType: DeliveryAddressRequiredError, status: 400 },
    { errorType: InsufficientStockError, status: 409 },
  ],
);
