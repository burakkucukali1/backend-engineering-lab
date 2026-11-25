import type { Order } from "../../../domain/entities/order.entity.js";
import type { OrderStatus } from "../../../domain/enums/order-status.js";
import type { OrderRepository } from "../../../domain/repositories/order.repository.js";

export interface UpdateOrderStatusInput {
  orderId: number;
  status: OrderStatus;
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: UpdateOrderStatusInput): Promise<Order> {
    if (!Number.isInteger(input.orderId) || input.orderId <= 0) {
      throw new Error("Invalid order ID");
    }

    const order = await this.orderRepository.findById(input.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.changeStatus(input.status);

    return this.orderRepository.update(order);
  }
}
