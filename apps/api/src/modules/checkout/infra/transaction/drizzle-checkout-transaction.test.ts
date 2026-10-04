import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@spinova/database";
import { RepositoryError } from "../../../../database/errors/repository.ts";
import { asDrizzleMock } from "../../../../test-utils/drizzle-mocks.ts";
import type {
  CheckoutCartSnapshot,
  CreateCheckoutOrderInput,
} from "../../application/ports/checkout-transaction.ts";
import { createCheckoutContext } from "../../../../composition-root.ts";
import { DrizzleCheckoutTransaction } from "./drizzle-checkout-transaction.ts";

vi.mock("@spinova/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@spinova/database")>();
  return {
    ...actual,
    db: { transaction: vi.fn() },
  };
});

type TransactionCallback = Parameters<typeof db.transaction>[0];
type TransactionClient = TransactionCallback extends (
  tx: infer Transaction,
) => unknown
  ? Transaction
  : never;

const createAwaitableChain = (result: unknown[]) => ({
  from: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  leftJoin: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  for: vi.fn().mockResolvedValue(result),
  then: (onfulfilled?: (value: unknown[]) => unknown) =>
    Promise.resolve(result).then(onfulfilled),
});

const addressRow = {
  id: "addr-1",
  userId: "user-1",
  label: "Casa",
  street: "Rua 1",
  number: "10",
  complement: null,
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  zipCode: "01000-000",
  country: "BR",
  isDefault: true,
};

const itemRow = {
  productId: "prod-1",
  quantity: 1,
  price: "150.00",
  title: "Album",
  artistName: "Artist",
  format: "vinyl" as const,
  imageUrl: null,
  imageAltText: null,
};

const persistedOrder = {
  id: "order-1",
  status: "pending" as const,
  total: "165.00",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

const setupTransaction = (
  stockUpdateResult: unknown[],
  orderResult: unknown[],
) => {
  const cartSelect = createAwaitableChain([{ id: "cart-1" }]);
  const itemsSelect = createAwaitableChain([itemRow]);
  const addressSelect = createAwaitableChain([addressRow]);
  const updateChain = {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue(stockUpdateResult),
  };
  let insertCount = 0;
  const insert = vi.fn().mockImplementation(() => {
    insertCount += 1;
    return {
      values: vi.fn().mockReturnThis(),
      returning: vi
        .fn()
        .mockResolvedValue(insertCount === 1 ? orderResult : undefined),
    };
  });
  const tx = {
    select: vi
      .fn()
      .mockReturnValueOnce(cartSelect)
      .mockReturnValueOnce(itemsSelect)
      .mockReturnValueOnce(addressSelect),
    update: vi.fn().mockReturnValue(updateChain),
    insert,
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    }),
  };

  vi.mocked(db.transaction).mockImplementation(
    async (callback: TransactionCallback) =>
      callback(asDrizzleMock<TransactionClient>(tx)),
  );

  return { tx, insert };
};

describe("DrizzleCheckoutTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides transaction-scoped persistence operations", async () => {
    const { tx, insert } = setupTransaction(
      [{ id: "prod-1" }],
      [persistedOrder],
    );
    const transaction = new DrizzleCheckoutTransaction(createCheckoutContext);

    const result = await transaction.execute(async (context) => {
      const cart = await context.getCartForUpdate("user-1");
      const address = await context.getDeliveryAddress("user-1");
      if (!cart || !address) throw new Error("fixture is incomplete");

      const unavailableProductId = await context.reserveStock(cart.items);
      if (unavailableProductId) throw new Error("fixture has no stock");

      const orderInput: CreateCheckoutOrderInput = {
        userId: "user-1",
        total: "165.00",
        address,
        items: cart.items,
      };
      const order = await context.createOrder(orderInput);
      await context.recordInventoryMovements(order.id, cart.items);
      await context.clearCart(cart.id);

      return { cart, address, order };
    });

    expect(result.cart).toEqual<CheckoutCartSnapshot>({
      id: "cart-1",
      items: [
        {
          productId: "prod-1",
          quantity: 1,
          unitPrice: "150.00",
          product: {
            id: "prod-1",
            title: "Album",
            artist: { name: "Artist" },
            format: "vinyl",
            image: null,
          },
        },
      ],
    });
    expect(result.address).toEqual(
      expect.objectContaining({ id: "addr-1", label: "Casa" }),
    );
    expect(result.order).toEqual(persistedOrder);
    expect(db.transaction).toHaveBeenCalledTimes(1);
    expect(tx.select).toHaveBeenCalledTimes(3);
    expect(tx.update).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledTimes(3);
    expect(insert.mock.results[0]?.value.values).toHaveBeenCalledWith(
      expect.objectContaining({
        addressSnapshot: expect.objectContaining({ id: "addr-1" }),
      }),
    );
    expect(insert.mock.results[1]?.value.values).toHaveBeenCalledWith([
      expect.objectContaining({
        productSnapshot: expect.objectContaining({ title: "Album" }),
      }),
    ]);
    expect(insert.mock.results[2]?.value.values).toHaveBeenCalledWith([
      expect.objectContaining({ reason: "Order order-1" }),
    ]);
    expect(tx.delete).toHaveBeenCalledTimes(1);
  });

  it("reports the product whose stock could not be reserved", async () => {
    setupTransaction([], []);
    const transaction = new DrizzleCheckoutTransaction(createCheckoutContext);

    await expect(
      transaction.execute(async (context) => {
        const cart = await context.getCartForUpdate("user-1");
        if (!cart) throw new Error("fixture is incomplete");
        return context.reserveStock(cart.items);
      }),
    ).resolves.toBe("prod-1");
  });

  it("wraps an empty order insert result", async () => {
    setupTransaction([{ id: "prod-1" }], []);
    const transaction = new DrizzleCheckoutTransaction(createCheckoutContext);

    await expect(
      transaction.execute(async (context) => {
        const cart = await context.getCartForUpdate("user-1");
        const address = await context.getDeliveryAddress("user-1");
        if (!cart || !address) throw new Error("fixture is incomplete");
        return context.createOrder({
          userId: "user-1",
          total: "165.00",
          address,
          items: cart.items,
        });
      }),
    ).rejects.toThrow(RepositoryError);
  });
});
