import { createDomainErrorMapper } from "../../../../http/plugins/domain-error-mapper.ts";
import {
  AddressHasOrdersError,
  AddressNotFoundError,
} from "../../domain/address.errors.ts";

export const addressErrorMapper = createDomainErrorMapper(
  "address-error-mapper",
  [
    { errorType: AddressHasOrdersError, status: 400 },
    { errorType: AddressNotFoundError, status: 404 },
  ],
);
