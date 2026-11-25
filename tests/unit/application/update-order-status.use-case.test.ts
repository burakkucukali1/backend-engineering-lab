import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateOrderStatusUseCase } from "../../../src/application/use-cases/order/update-order-status.use-case.js";
import { Order } from "../../../src/domain/entities/order.entity.js";
import { OrderItem } from "../../../src/domain/entities/order-item.entity.js";
import { ORDER_STATUS } from "../../../src/domain/enums/order-status.js";
import { PAYMENT_STATUS } from "../../../src/domain/enums/payment-status.js";
import type { OrderRepository } from "../../../src/domain/repositories/order.repository.js";

describe("UpdateOrderStatusUseCase", () => {
  let orderRepository: {
    findById: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  let useCase: UpdateOrderStatusUseCase;

  const createOrder = () =>
    new Order({
      id: 1,
      userId: 10,
      status: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      totalAmount: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        new OrderItem({
          id: 1,
          orderId: 1,
          productId: 5,
          quantity: 2,
          unitPrice: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ],
    });

  beforeEach(() => {
    orderRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    };

    useCase = new UpdateOrderStatusUseCase(
      orderRepository as unknown as OrderRepository,
    );
  });

  it("should update order status successfully", async () => {
    const order = createOrder();

    orderRepository.findById.mockResolvedValue(order);
    orderRepository.update.mockImplementation(
      async (updatedOrder) => updatedOrder,
    );

    const result = await useCase.execute({
      orderId: 1,
      status: ORDER_STATUS.CONFIRMED,
    });

    expect(result.status).toBe(ORDER_STATUS.CONFIRMED);
    expect(orderRepository.findById).toHaveBeenCalledWith(1);
    expect(orderRepository.update).toHaveBeenCalledWith(order);
  });

  it("should reject an invalid order ID", async () => {
    await expect(
      useCase.execute({
        orderId: 0,
        status: ORDER_STATUS.CONFIRMED,
      }),
    ).rejects.toThrow("Invalid order ID");

    expect(orderRepository.findById).not.toHaveBeenCalled();
  });

  it("should reject when order does not exist", async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        orderId: 999,
        status: ORDER_STATUS.CONFIRMED,
      }),
    ).rejects.toThrow("Order not found");

    expect(orderRepository.update).not.toHaveBeenCalled();
  });

  it("should reject an invalid status transition", async () => {
    const order = createOrder();
    orderRepository.findById.mockResolvedValue(order);

    await expect(
      useCase.execute({
        orderId: 1,
        status: ORDER_STATUS.SHIPPED,
      }),
    ).rejects.toThrow("Cannot change order status");

    expect(orderRepository.update).not.toHaveBeenCalled();
  });

  it("should propagate repository errors", async () => {
    const order = createOrder();
    orderRepository.findById.mockResolvedValue(order);
    orderRepository.update.mockRejectedValue(new Error("Database error"));

    await expect(
      useCase.execute({
        orderId: 1,
        status: ORDER_STATUS.CONFIRMED,
      }),
    ).rejects.toThrow("Database error");
  });
});
