import { api } from "./api";

export type WishlistProduct = {
  id: string;
  albumId: string;
  title: string;
  artist: {
    id: string;
    name: string;
    slug: string;
  };
  sku: string;
  format: "vinyl" | "cd" | "cassette";
  edition: "standard" | "deluxe" | "colored";
  price: string;
  compareAtPrice: string | null;
  currency: "BRL";
  stockQuantity: number;
  inStock: boolean;
  isImported: boolean;
  genre: string | null;
  releaseDate: string | null;
};

export type WishlistItem = {
  id: string;
  product: WishlistProduct;
  createdAt: string;
};

export const getWishlist = async (): Promise<WishlistItem[]> => {
  const { data } = await api.get<{ data: WishlistItem[] }>("/wishlist");
  return data.data;
};

export const addToWishlist = async (productId: string): Promise<void> => {
  await api.post(`/wishlist/${productId}`);
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  await api.delete(`/wishlist/${productId}`);
};
