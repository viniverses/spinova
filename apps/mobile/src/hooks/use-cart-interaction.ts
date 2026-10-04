import { useState } from "react";

import { useCart, useUpdateCartItemQuantity } from "@/hooks/use-cart";
import type { CartItem } from "@/services/cart";

import { getQuantityChange, getQuantityControls } from "./cart-interaction";

export function useCartInteraction() {
  const cart = useCart();
  const updateQuantity = useUpdateCartItemQuantity();
  const [pendingRemoval, setPendingRemoval] = useState<{
    productId: string;
    title: string;
  } | null>(null);

  const changeQuantity = (
    item: CartItem,
    direction: "decrease" | "increase",
  ) => {
    const change = getQuantityChange(item, direction, updateQuantity.isPending);
    if (change === "confirm-removal") {
      setPendingRemoval({
        productId: item.product.id,
        title: item.product.title,
      });
    } else if (change) {
      updateQuantity.mutate({ productId: item.product.id, ...change });
    }
  };

  const confirmRemoval = () => {
    if (!pendingRemoval || updateQuantity.isPending) return;
    updateQuantity.mutate({ productId: pendingRemoval.productId, quantity: 0 });
    setPendingRemoval(null);
  };

  return {
    isLoading: cart.isPending,
    isLoadError: cart.isError,
    retry: cart.refetch,
    items: (cart.data?.items ?? []).map((item) => ({
      item,
      ...getQuantityControls(item, updateQuantity.isPending),
    })),
    totals: {
      subtotal: cart.data?.subtotal ?? "0.00",
      shipping: cart.data?.shipping ?? "0.00",
      total: cart.data?.total ?? "0.00",
    },
    isUpdating: updateQuantity.isPending,
    hasUpdateError: updateQuantity.isError,
    dismissUpdateError: updateQuantity.reset,
    changeQuantity,
    pendingRemoval,
    cancelRemoval: () => setPendingRemoval(null),
    confirmRemoval,
  };
}
