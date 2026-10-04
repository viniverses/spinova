import type { CartItem } from "@/services/cart";

const MAX_QUANTITY = 99;

export function getQuantityControls(item: CartItem, isUpdating: boolean) {
  const limit = Math.min(item.product.stockQuantity, MAX_QUANTITY);

  return {
    decreaseDisabled: isUpdating,
    increaseDisabled: isUpdating || item.quantity >= limit,
  };
}

export function getQuantityChange(
  item: CartItem,
  direction: "decrease" | "increase",
  isUpdating: boolean,
): { quantity: number } | "confirm-removal" | null {
  const controls = getQuantityControls(item, isUpdating);

  if (direction === "increase") {
    return controls.increaseDisabled ? null : { quantity: item.quantity + 1 };
  }

  if (controls.decreaseDisabled) return null;
  return item.quantity <= 1
    ? "confirm-removal"
    : { quantity: item.quantity - 1 };
}
