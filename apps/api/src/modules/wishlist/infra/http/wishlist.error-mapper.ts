import { createDomainErrorMapper } from "../../../../http/plugins/domain-error-mapper.ts";
import {
  ProductNotFoundError,
  WishlistDuplicateError,
  WishlistEntryNotFoundError,
} from "../../domain/wishlist.errors.ts";

export const wishlistErrorMapper = createDomainErrorMapper(
  "wishlist-error-mapper",
  [
    { errorType: ProductNotFoundError, status: 404 },
    { errorType: WishlistDuplicateError, status: 409 },
    { errorType: WishlistEntryNotFoundError, status: 404 },
  ],
);
