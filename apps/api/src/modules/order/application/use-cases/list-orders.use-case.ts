import type {
  IOrderRepository,
  OrderPage,
} from "../../domain/repositories/order.repository.interface.ts";

export interface ListOrdersInput {
  userId: string;
  page?: number;
  pageSize?: number;
}

export class ListOrdersUseCase {
  private readonly orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  public async execute(input: ListOrdersInput): Promise<OrderPage> {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, input.pageSize ?? 20));

    const result = await this.orderRepository.listByUser(
      input.userId,
      page,
      pageSize,
    );

    return result;
  }
}
