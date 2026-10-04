import { describe, expect, it } from "vitest";

import { Money } from "./money.ts";

describe("Money", () => {
  it("parses and formats decimal amounts without floating point arithmetic", () => {
    expect(
      Money.fromDecimal("0.10").add(Money.fromDecimal("0.20")).toDecimal(),
    ).toBe("0.30");
  });

  it("multiplies by a quantity in integer cents", () => {
    expect(Money.fromDecimal("49.90").multiply(3).cents).toBe(14970);
  });

  it("rejects excess decimal precision and unsafe values", () => {
    expect(() => Money.fromDecimal("1.001")).toThrow(RangeError);
    expect(() => Money.fromCents(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
  });

  it("formats negative cents correctly", () => {
    expect(Money.fromCents(-1).toDecimal()).toBe("-0.01");
  });
});
