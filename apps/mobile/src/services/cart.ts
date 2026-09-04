import { api } from "./api";
import type { ProductCatalogItem } from "./products";

export type CartItem = {
  id: string;
  quantity: number;
  product: ProductCatalogItem;
};

export type Cart = {
  id: string | null;
  items: CartItem[];
  subtotal: string;
  totalQuantity: number;
  currency: "BRL";
};

export const getCart = async (): Promise<Cart> => {
  const { data } = await api.get<{ data: Cart }>("/cart");
  return data.data;
};

export const addCartItem = async (productId: string): Promise<CartItem> => {
  const { data } = await api.post<{ data: CartItem }>(
    `/cart/items/${encodeURIComponent(productId)}`,
  );
  return data.data;
};

export const updateCartItemQuantity = async (
  productId: string,
  quantity: number,
): Promise<Cart> => {
  const { data } = await api.patch<{ data: Cart }>(
    `/cart/items/${encodeURIComponent(productId)}`,
    { quantity },
  );
  return data.data;
};
