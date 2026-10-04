import type { Cart } from "../entities/cart.entity.ts";

export interface ICartRepository {
  getCartByUserId(userId: string): Promise<Cart>;
  save(userId: string, cart: Cart, expectedCart: Cart): Promise<void>;
}
