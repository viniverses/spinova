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

const summarize = (cart: Cart): Cart => ({
  ...cart,
  subtotal: (
    cart.items.reduce(
      (sum, item) =>
        sum + Math.round(Number(item.product.price) * 100) * item.quantity,
      0,
    ) / 100
  ).toFixed(2),
  totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
});

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
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartQueryKey });
      const previous = queryClient.getQueryData<Cart>(cartQueryKey);

      queryClient.setQueryData<Cart>(cartQueryKey, (current) => {
        if (!current) return current;
        const items =
          quantity === 0
            ? current.items.filter((item) => item.product.id !== productId)
            : current.items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item,
              );
        return summarize({ ...current, items });
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(cartQueryKey, context.previous);
      }
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
};
