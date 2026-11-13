import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  selectWishlistIds,
  selectWishlistItems,
  wishlistMutationOptions,
  wishlistQueryOptions,
} from "@/lib/wishlist-cache";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/services/wishlist";

const wishlistApi = { getWishlist, addToWishlist, removeFromWishlist };

export const useWishlist = () => {
  const client = useQueryClient();
  return useQuery({
    ...wishlistQueryOptions(client, wishlistApi),
    select: selectWishlistItems,
  });
};

export const useWishlistIds = (options?: { enabled?: boolean }) => {
  const client = useQueryClient();
  return useQuery({
    ...wishlistQueryOptions(client, wishlistApi),
    select: selectWishlistIds,
    enabled: options?.enabled ?? true,
  });
};

export const useIsWishlisted = (
  productId: string,
  options?: { enabled?: boolean },
) => {
  const client = useQueryClient();
  return useQuery({
    ...wishlistQueryOptions(client, wishlistApi),
    select: (cache) => selectWishlistIds(cache).has(productId),
    enabled: options?.enabled ?? true,
  });
};

export const useToggleWishlist = (productId: string) => {
  const client = useQueryClient();
  const mutation = useMutation(wishlistMutationOptions(client, wishlistApi));
  const pending = useQuery({
    ...wishlistQueryOptions(client, wishlistApi),
    enabled: false,
    select: (cache) => cache.changes[productId]?.pending ?? false,
  });

  return { ...mutation, isPending: mutation.isPending || !!pending.data };
};
