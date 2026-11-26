import { describe, it, expect, vi } from "vitest";

import { GetOrderByIdUseCase } from "../../../src/application/use-cases/order/get-order-by-id.use-case.js";
import { OrderNotFoundError } from "../../../src/application/errors/order-not-found.error.js";

import type { OrderRepository } from "../../../src/domain/repositories/order.repository.js";
import type { Order } from "../../../src/domain/entities/order.entity.js";

describe("GetOrderByIdUseCase", () => {
  const orderId = 1;
  const userId = 10;

  const existingOrder = {
    id: orderId,
    userId,
  } as Order;

  const createOrderRepositoryMock = (): OrderRepository => ({
    findById: vi.fn().mockResolvedValue(existingOrder),
    findByUserId: vi.fn(),
    createFromCart: vi.fn(),
    update: vi.fn(),
  });

  it("should return an order when it belongs to the user", async () => {
    const orderRepository = createOrderRepositoryMock();
    const useCase = new GetOrderByIdUseCase(orderRepository);

    const result = await useCase.execute(orderId, userId);

    expect(result).toBe(existingOrder);
    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(orderRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("should throw OrderNotFoundError when the order does not exist", async () => {
    const orderRepository = createOrderRepositoryMock();

    vi.mocked(orderRepository.findById).mockResolvedValue(null);

    const useCase = new GetOrderByIdUseCase(orderRepository);

    await expect(useCase.execute(orderId, userId)).rejects.toThrow(
      OrderNotFoundError,
    );
  });

  it("should throw OrderNotFoundError when the order belongs to another user", async () => {
    const orderRepository = createOrderRepositoryMock();

    vi.mocked(orderRepository.findById).mockResolvedValue({
      ...existingOrder,
      userId: 99,
    } as Order);

    const useCase = new GetOrderByIdUseCase(orderRepository);

    await expect(useCase.execute(orderId, userId)).rejects.toThrow(
      OrderNotFoundError,
    );
  });

  it("should reject an invalid order ID", async () => {
    const orderRepository = createOrderRepositoryMock();
    const useCase = new GetOrderByIdUseCase(orderRepository);

    await expect(useCase.execute(0, userId)).rejects.toThrow(
      "Invalid order ID",
    );

    expect(orderRepository.findById).not.toHaveBeenCalled();
  });

  it("should reject an invalid user ID", async () => {
    const orderRepository = createOrderRepositoryMock();
    const useCase = new GetOrderByIdUseCase(orderRepository);

    await expect(useCase.execute(orderId, 0)).rejects.toThrow(
      "Invalid user ID",
    );

    expect(orderRepository.findById).not.toHaveBeenCalled();
  });
});
