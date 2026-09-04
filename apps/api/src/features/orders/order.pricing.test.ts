import assert from "node:assert/strict";
import test from "node:test";

import { calculateOrderTotal } from "./order.pricing.ts";

test("calculates the order total from authoritative prices plus shipping", () => {
  assert.equal(
    calculateOrderTotal([
      { price: "105.90", quantity: 2 },
      { price: "89.90", quantity: 1 },
    ]),
    "316.70",
  );
});
