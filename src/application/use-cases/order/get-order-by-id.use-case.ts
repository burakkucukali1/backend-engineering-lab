import type { Order } from "../../../domain/entities/order.entity.js";
import type { OrderRepository } from "../../../domain/repositories/order.repository.js";
import { OrderNotFoundError } from "../../errors/order-not-found.error.js";

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: number, userId: number): Promise<Order> {
    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new Error("Invalid order ID");
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order || order.userId !== userId) {
      throw new OrderNotFoundError();
    }

    return order;
  }
}
