import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addCartItem,
  getCart,
  updateCartItemQuantity,
  type Cart,
} from "@/services/cart";

export const cartQueryKey = ["cart"] as const;
const ADD_TO_CART_FEEDBACK_MS = 500;

const wait = (duration: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration));

export const useCart = () =>
  useQuery({
    queryKey: cartQueryKey,
    queryFn: getCart,
  });

export const useCartItemQuantity = (productId: string) =>
  useQuery({
    queryKey: cartQueryKey,
    queryFn: getCart,
    select: (cart) =>
      cart.items.find((item) => item.product.id === productId)?.quantity ?? 0,
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const [cart] = await Promise.all([
        addCartItem(productId),
        wait(ADD_TO_CART_FEEDBACK_MS),
      ]);

      return cart;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData<Cart>(cartQueryKey, cart);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
};

type UpdateQuantityVariables = {
  productId: string;
  quantity: number;
};

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: UpdateQuantityVariables) =>
      updateCartItemQuantity(productId, quantity),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
};
