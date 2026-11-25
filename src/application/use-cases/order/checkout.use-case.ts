import type { Order } from "../../../domain/entities/order.entity.js";
import type { OrderRepository } from "../../../domain/repositories/order.repository.js";

export class CheckoutUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(userId: number): Promise<Order> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID");
    }

    return this.orderRepository.createFromCart(userId);
  }
}
