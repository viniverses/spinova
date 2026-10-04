import { describe, expect, it, vi } from "vitest";

import type { PricingCalculator } from "../../../../shared/contracts/pricing.ts";
import { Money } from "../../../../shared/value-objects/money.ts";
import {
  CartEmptyError,
  DeliveryAddressRequiredError,
  InsufficientStockError,
} from "../../domain/checkout.errors.ts";
import type {
  CheckoutCartSnapshot,
  CheckoutTransaction,
  CheckoutTransactionContext,
  PersistedCheckoutOrder,
} from "../ports/checkout-transaction.ts";
import { CheckoutCartUseCase } from "./checkout-cart.use-case.ts";

const cart: CheckoutCartSnapshot = {
  id: "cart-1",
  items: [
    {
      productId: "prod-1",
      quantity: 2,
      unitPrice: "75.00",
      product: {
        id: "prod-1",
        title: "Album",
        artist: { name: "Artist" },
        format: "vinyl",
        image: null,
      },
    },
  ],
};

const address = {
  id: "addr-1",
  label: "Casa",
  street: "Rua 1",
  number: "10",
  complement: null,
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  zipCode: "01000-000",
  country: "BR",
};

const persistedOrder: PersistedCheckoutOrder = {
  id: "ord-123",
  status: "pending",
  total: "165.00",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

const createContext = (
  overrides: Partial<CheckoutTransactionContext> = {},
): CheckoutTransactionContext => ({
  getCartForUpdate: vi.fn().mockResolvedValue(cart),
  getDeliveryAddress: vi.fn().mockResolvedValue(address),
  reserveStock: vi.fn().mockResolvedValue(null),
  createOrder: vi.fn().mockResolvedValue(persistedOrder),
  recordInventoryMovements: vi.fn().mockResolvedValue(undefined),
  clearCart: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

const createTransaction = (
  context: CheckoutTransactionContext,
): CheckoutTransaction => ({
  async execute<Result>(
    operation: (context: CheckoutTransactionContext) => Promise<Result>,
  ): Promise<Result> {
    return operation(context);
  },
});

const createPricingCalculator = (): PricingCalculator => ({
  calculateQuote: vi.fn().mockReturnValue({
    subtotal: Money.fromDecimal("150.00"),
    shipping: Money.fromDecimal("15.00"),
    total: Money.fromDecimal("165.00"),
    currency: "BRL",
  }),
});

describe("CheckoutCartUseCase", () => {
  it("orchestrates the complete checkout inside one transaction", async () => {
    const context = createContext();
    const pricingCalculator = createPricingCalculator();
    const useCase = new CheckoutCartUseCase(
      createTransaction(context),
      pricingCalculator,
    );

    await expect(useCase.execute({ userId: "user-1" })).resolves.toEqual({
      ...persistedOrder,
      currency: "BRL",
    });

    expect(context.getCartForUpdate).toHaveBeenCalledWith("user-1");
    expect(context.getDeliveryAddress).toHaveBeenCalledWith("user-1");
    expect(pricingCalculator.calculateQuote).toHaveBeenCalledWith([
      { price: Money.fromDecimal("75.00"), quantity: 2 },
    ]);
    expect(context.reserveStock).toHaveBeenCalledWith(cart.items);
    expect(context.createOrder).toHaveBeenCalledWith({
      userId: "user-1",
      total: "165.00",
      address,
      items: cart.items,
    });
    expect(context.recordInventoryMovements).toHaveBeenCalledWith(
      persistedOrder.id,
      cart.items,
    );
    expect(context.clearCart).toHaveBeenCalledWith(cart.id);
  });

  it.each([null, { id: "cart-1", items: [] }])(
    "rejects an absent or empty cart",
    async (emptyCart) => {
      const context = createContext({
        getCartForUpdate: vi.fn().mockResolvedValue(emptyCart),
      });
      const useCase = new CheckoutCartUseCase(
        createTransaction(context),
        createPricingCalculator(),
      );

      await expect(useCase.execute({ userId: "user-1" })).rejects.toThrow(
        CartEmptyError,
      );
      expect(context.getDeliveryAddress).not.toHaveBeenCalled();
    },
  );

  it("requires a delivery address before pricing and reserving stock", async () => {
    const context = createContext({
      getDeliveryAddress: vi.fn().mockResolvedValue(null),
    });
    const pricingCalculator = createPricingCalculator();
    const useCase = new CheckoutCartUseCase(
      createTransaction(context),
      pricingCalculator,
    );

    await expect(useCase.execute({ userId: "user-1" })).rejects.toThrow(
      DeliveryAddressRequiredError,
    );
    expect(pricingCalculator.calculateQuote).not.toHaveBeenCalled();
    expect(context.reserveStock).not.toHaveBeenCalled();
  });

  it("rejects the checkout when stock cannot be reserved", async () => {
    const context = createContext({
      reserveStock: vi.fn().mockResolvedValue("prod-1"),
    });
    const useCase = new CheckoutCartUseCase(
      createTransaction(context),
      createPricingCalculator(),
    );

    await expect(useCase.execute({ userId: "user-1" })).rejects.toMatchObject({
      constructor: InsufficientStockError,
      productId: "prod-1",
    });
    expect(context.createOrder).not.toHaveBeenCalled();
    expect(context.clearCart).not.toHaveBeenCalled();
  });
});
