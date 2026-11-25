import type { Order } from "../entities/order.entity.js";

export interface OrderRepository {
  findById(id: number): Promise<Order | null>;

  findByUserId(userId: number): Promise<Order[]>;

  createFromCart(userId: number): Promise<Order>;

  update(order: Order): Promise<Order>;
}
