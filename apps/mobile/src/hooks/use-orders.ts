import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartQueryKey } from "@/hooks/use-cart";
import type { Cart } from "@/services/cart";
import { completeCheckout } from "@/services/orders";

export const useCompleteCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeCheckout,
    onSuccess: () => {
      queryClient.setQueryData<Cart>(cartQueryKey, (current) =>
        current
          ? {
              ...current,
              items: [],
              subtotal: "0.00",
              totalQuantity: 0,
            }
          : current,
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
};
