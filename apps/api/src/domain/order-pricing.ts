export const SHIPPING_IN_CENTS = 1500;

type PricedItem = {
  price: string;
  quantity: number;
};

export type OrderPricing = {
  subtotal: string;
  shipping: string;
  total: string;
};

const formatCents = (value: number) => (value / 100).toFixed(2);

export const calculateOrderPricing = (items: PricedItem[]): OrderPricing => {
  const subtotalInCents = items.reduce(
    (sum, item) => sum + Math.round(Number(item.price) * 100) * item.quantity,
    0,
  );
  const shippingInCents = items.length > 0 ? SHIPPING_IN_CENTS : 0;

  return {
    subtotal: formatCents(subtotalInCents),
    shipping: formatCents(shippingInCents),
    total: formatCents(subtotalInCents + shippingInCents),
  };
};
