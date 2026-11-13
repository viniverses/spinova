import { api } from "./api";
import type { ProductCatalogItem } from "./products";

export type WishlistItem = {
  id: string;
  product: ProductCatalogItem;
  createdAt: string;
};

export const getWishlist = async (
  signal?: AbortSignal,
): Promise<WishlistItem[]> => {
  const { data } = await api.get<{ data: WishlistItem[] }>("/wishlist", {
    signal,
  });
  return data.data;
};

export const addToWishlist = async (productId: string): Promise<void> => {
  await api.post(`/wishlist/${productId}`);
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  await api.delete(`/wishlist/${productId}`);
};
