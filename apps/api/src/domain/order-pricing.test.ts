import { expect, test } from "vitest";

import { calculateOrderPricing } from "./order-pricing.ts";

test("calculates authoritative subtotal, shipping and total", () => {
  expect(
    calculateOrderPricing([
      { price: "105.90", quantity: 2 },
      { price: "89.90", quantity: 1 },
    ]),
  ).toEqual({
    subtotal: "301.70",
    shipping: "15.00",
    total: "316.70",
  });
});

test("does not charge shipping for an empty cart", () => {
  expect(calculateOrderPricing([])).toEqual({
    subtotal: "0.00",
    shipping: "0.00",
    total: "0.00",
  });
});

test("rounds each unit price to cents before multiplying", () => {
  expect(calculateOrderPricing([{ price: "10.005", quantity: 2 }])).toEqual({
    subtotal: "20.02",
    shipping: "15.00",
    total: "35.02",
  });
});
