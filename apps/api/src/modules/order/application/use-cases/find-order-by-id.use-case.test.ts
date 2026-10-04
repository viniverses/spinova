import { describe, expect, it } from "vitest";

import { Money } from "../../../../shared/value-objects/money.ts";
import { OrderNotFoundError } from "../../domain/order.errors.ts";
import { Order } from "../../domain/entities/order.entity.ts";
import { OrderItem } from "../../domain/entities/order-item.entity.ts";
import type {
  IOrderRepository,
  OrderPage,
} from "../../domain/repositories/order.repository.interface.ts";
import { FindOrderByIdUseCase } from "./find-order-by-id.use-case.ts";

class InMemoryOrderRepository implements IOrderRepository {
  private readonly orderToReturn: Order | null;

  constructor(orderToReturn: Order | null) {
    this.orderToReturn = orderToReturn;
  }

  public async findById(
    _userId: string,
    _orderId: string,
  ): Promise<Order | null> {
    return this.orderToReturn;
  }

  public async listByUser(): Promise<OrderPage> {
    return {
      orders: [],
      pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 },
    };
  }
}

describe("FindOrderByIdUseCase", () => {
  it("returns order when found", async () => {
    const fakeOrder = new Order({
      id: "ord-1",
      userId: "user-1",
      status: "paid",
      total: Money.fromDecimal("250.00"),
      currency: "BRL",
      addressId: "addr-1",
      createdAt: new Date(),
      items: [
        new OrderItem({
          id: "item-1",
          orderId: "ord-1",
          productId: "prod-1",
          quantity: 1,
          unitPrice: Money.fromDecimal("250.00"),
          product: {
            id: "prod-1",
            title: "Abbey Road",
            artist: { name: "The Beatles" },
            format: "vinyl",
            image: null,
          },
        }),
      ],
      address: {
        id: "addr-1",
        label: "Home",
        street: "Main St",
        number: "123",
        complement: null,
        neighborhood: "Downtown",
        city: "Sao Paulo",
        state: "SP",
        zipCode: "01000-000",
        country: "BR",
      },
    });

    const repo = new InMemoryOrderRepository(fakeOrder);
    const useCase = new FindOrderByIdUseCase(repo);

    const result = await useCase.execute({
      userId: "user-1",
      orderId: "ord-1",
    });
    expect(result.id).toBe("ord-1");
    expect(result.status).toBe("paid");
    expect(result.items.length).toBe(1);
  });

  it("throws OrderNotFoundError when order does not exist", async () => {
    const repo = new InMemoryOrderRepository(null);
    const useCase = new FindOrderByIdUseCase(repo);

    await expect(
      useCase.execute({ userId: "user-1", orderId: "ord-missing" }),
    ).rejects.toThrow(OrderNotFoundError);
  });
});
