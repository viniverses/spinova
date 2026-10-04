import type { Order } from "../entities/order.entity.ts";
import type { Pagination } from "../../../../shared/contracts/pagination.ts";

export interface OrderPage {
  orders: Order[];
  pagination: Pagination;
}

export interface IOrderRepository {
  findById(userId: string, orderId: string): Promise<Order | null>;
  listByUser(
    userId: string,
    page?: number,
    pageSize?: number,
  ): Promise<OrderPage>;
}
