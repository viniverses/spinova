export const SHIPPING_IN_CENTS = 1500;

type PricedItem = {
  price: string;
  quantity: number;
};

export const calculateOrderTotal = (items: PricedItem[]) => {
  const itemsInCents = items.reduce(
    (sum, item) => sum + Math.round(Number(item.price) * 100) * item.quantity,
    0,
  );

  return ((itemsInCents + SHIPPING_IN_CENTS) / 100).toFixed(2);
};
