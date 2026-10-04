import { describe, expect, it } from "vitest";

import type {
  IOrderRepository,
  OrderPage,
} from "../../domain/repositories/order.repository.interface.ts";
import { ListOrdersUseCase } from "./list-orders.use-case.ts";

class InMemoryOrderRepository implements IOrderRepository {
  public lastPageRequested?: number;
  public lastPageSizeRequested?: number;

  public async findById(): Promise<null> {
    return null;
  }

  public async listByUser(
    userId: string,
    page = 1,
    pageSize = 20,
  ): Promise<OrderPage> {
    this.lastPageRequested = page;
    this.lastPageSizeRequested = pageSize;

    return {
      orders: [],
      pagination: {
        page,
        pageSize,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }
}

describe("ListOrdersUseCase", () => {
  it("applies default pagination and executes reader", async () => {
    const repository = new InMemoryOrderRepository();
    const useCase = new ListOrdersUseCase(repository);

    const result = await useCase.execute({ userId: "user-1" });

    expect(repository.lastPageRequested).toBe(1);
    expect(repository.lastPageSizeRequested).toBe(20);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.pageSize).toBe(20);
  });

  it("clamps pagination values within valid limits", async () => {
    const repository = new InMemoryOrderRepository();
    const useCase = new ListOrdersUseCase(repository);

    await useCase.execute({ userId: "user-1", page: -5, pageSize: 200 });

    expect(repository.lastPageRequested).toBe(1);
    expect(repository.lastPageSizeRequested).toBe(100);
  });
});
