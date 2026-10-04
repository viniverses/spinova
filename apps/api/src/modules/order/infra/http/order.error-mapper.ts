import { createDomainErrorMapper } from "../../../../http/plugins/domain-error-mapper.ts";
import {
  InvalidOrderError,
  InvalidOrderItemError,
  OrderNotFoundError,
} from "../../domain/order.errors.ts";

export const orderErrorMapper = createDomainErrorMapper("order-error-mapper", [
  { errorType: OrderNotFoundError, status: 404 },
  { errorType: InvalidOrderError, status: 400 },
  { errorType: InvalidOrderItemError, status: 400 },
]);
