import type { WishlistEntry } from "../../domain/wishlist.types.ts";
import type { WishlistItem } from "../wishlist-item.ts";

export type AddWishlistResult =
  | { kind: "added"; entry: WishlistEntry }
  | { kind: "product-not-found" }
  | { kind: "duplicate" };

export type RemoveWishlistResult =
  | { kind: "removed" }
  | { kind: "not-found" };

export interface IWishlistRepository {
  findByUserId(userId: string): Promise<WishlistItem[]>;
  add(userId: string, productId: string): Promise<AddWishlistResult>;
  remove(userId: string, productId: string): Promise<RemoveWishlistResult>;
}
