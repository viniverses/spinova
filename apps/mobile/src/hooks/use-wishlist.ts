import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "@/services/wishlist";

const wishlistQueryKey = ["wishlist", "list"] as const;

type ToggleWishlistVariables = {
  productId: string;
  isFavorited: boolean;
};

export const useWishlist = () =>
  useQuery({
    queryKey: wishlistQueryKey,
    queryFn: getWishlist,
  });

export const useIsWishlisted = (productId: string) =>
  useQuery({
    queryKey: wishlistQueryKey,
    queryFn: getWishlist,
    select: (items) => items.some((item) => item.product.id === productId),
  });

/**
 * Toggles a single product's wishlist state using the state shown to the user
 * when they tap the button.
 */
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, isFavorited }: ToggleWishlistVariables) => {
      if (isFavorited) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: wishlistQueryKey });

      const previous =
        queryClient.getQueryData<WishlistItem[]>(wishlistQueryKey);

      queryClient.setQueryData<WishlistItem[]>(wishlistQueryKey, (old) => {
        if (!old) return old;

        const isFavorited = old.some((item) => item.product.id === productId);

        if (isFavorited) {
          return old.filter((item) => item.product.id !== productId);
        }

        // Optimistic add — placeholder shape, flagged so any UI rendering
        // full wishlist items (not just useIsWishlisted) can skip/skeleton
        // it until the real data lands on settle.
        const optimisticItem: WishlistItem & { isOptimistic?: boolean } = {
          id: `temp-${productId}`,
          isOptimistic: true,
          product: {
            id: productId,
            albumId: "",
            title: "",
            artist: { id: "", name: "", slug: "" },
            sku: "",
            format: "vinyl",
            edition: "standard",
            price: "0.00",
            compareAtPrice: null,
            currency: "BRL",
            stockQuantity: 0,
            inStock: false,
            isImported: false,
            genre: null,
            releaseDate: null,
            image: null,
          },
          createdAt: new Date().toISOString(),
        };

        return [...old, optimisticItem];
      });

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(wishlistQueryKey, context.previous);
      }
    },
    onSettled: (_data, _err, _variables) => {
      void queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
    },
  });
};
