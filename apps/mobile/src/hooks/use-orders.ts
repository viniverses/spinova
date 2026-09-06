import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cartQueryKey } from "@/hooks/use-cart";
import { productKeys } from "@/hooks/use-products";
import type { Cart } from "@/services/cart";
import {
  completeCheckout,
  getOrderById,
  getOrders,
} from "@/services/orders";

export const ordersQueryKey = ["orders"] as const;

export const ordersKeys = {
  all: ordersQueryKey,
  list: (page?: number, pageSize?: number) =>
    [...ordersQueryKey, "list", { page, pageSize }] as const,
  detail: (id: string) => [...ordersQueryKey, "detail", id] as const,
};

export const useOrders = (page = 1, pageSize = 20) =>
  useQuery({
    queryKey: ordersKeys.list(page, pageSize),
    queryFn: () => getOrders(page, pageSize),
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });

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
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
      void queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    },
  });
};
