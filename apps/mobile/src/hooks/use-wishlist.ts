import {
  queryOptions,
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "@/services/wishlist";

const wishlistQueryKey = ["wishlist"] as const;
const wishlistMutationKey = ["wishlist", "toggle"] as const;

const wishlistQueryOptions = queryOptions({
  queryKey: wishlistQueryKey,
  queryFn: ({ signal }) => getWishlist(signal),
});

const selectWishlistIds = (items: WishlistItem[]) =>
  new Set(items.map((item) => item.product.id));

type ToggleWishlistVariables = {
  productId: string;
  isFavorited: boolean;
};

export const useWishlist = () => {
  const mutations = useIsMutating({ mutationKey: wishlistMutationKey });
  const query = useQuery(wishlistQueryOptions);
  return { ...query, isRefreshing: query.isRefetching && mutations === 0 };
};

export const useWishlistIds = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...wishlistQueryOptions,
    select: selectWishlistIds,
    enabled: options?.enabled ?? true,
  });
};

export const useIsWishlisted = (
  productId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    ...wishlistQueryOptions,
    select: (items) => items.some((item) => item.product.id === productId),
    enabled: options?.enabled ?? true,
  });
};

export const useToggleWishlist = (productId: string) => {
  const client = useQueryClient();
  const mutationKey = [...wishlistMutationKey, productId];
  const pending = useIsMutating({ mutationKey });
  const mutation = useMutation({
    mutationKey,
    mutationFn: ({ productId, isFavorited }: ToggleWishlistVariables) =>
      isFavorited ? removeFromWishlist(productId) : addToWishlist(productId),
    onSuccess: () => client.invalidateQueries({ queryKey: wishlistQueryKey }),
  });

  return { ...mutation, isPending: mutation.isPending || pending > 0 };
};
