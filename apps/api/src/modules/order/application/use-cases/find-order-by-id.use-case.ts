import { Order } from "../../domain/entities/order.entity.ts";
import { OrderNotFoundError } from "../../domain/order.errors.ts";
import type { IOrderRepository } from "../../domain/repositories/order.repository.interface.ts";

export interface FindOrderByIdInput {
  userId: string;
  orderId: string;
}

export class FindOrderByIdUseCase {
  private readonly orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  public async execute(input: FindOrderByIdInput): Promise<Order> {
    const snapshot = await this.orderRepository.findById(
      input.userId,
      input.orderId,
    );

    if (!snapshot) {
      throw new OrderNotFoundError(input.orderId);
    }

    return snapshot;
  }
}
