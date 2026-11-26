import { describe, it, expect, vi } from "vitest";

import { GetMyOrdersUseCase } from "../../../src/application/use-cases/order/get-my-orders.use-case.js";

import type { OrderRepository } from "../../../src/domain/repositories/order.repository.js";
import type { Order } from "../../../src/domain/entities/order.entity.js";

describe("GetMyOrdersUseCase", () => {
  const userId = 1;

  const createOrderRepositoryMock = (): OrderRepository => ({
    findById: vi.fn(),
    findByUserId: vi.fn().mockResolvedValue([]),
    createFromCart: vi.fn(),
    update: vi.fn(),
  });

  it("should return orders belonging to the user", async () => {
    const orderRepository = createOrderRepositoryMock();
    const expectedOrders = [{ id: 1 }, { id: 2 }] as Order[];

    vi.mocked(orderRepository.findByUserId).mockResolvedValue(expectedOrders);

    const useCase = new GetMyOrdersUseCase(orderRepository);

    const result = await useCase.execute(userId);

    expect(result).toBe(expectedOrders);
    expect(orderRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(orderRepository.findByUserId).toHaveBeenCalledTimes(1);
  });

  it("should return an empty array when the user has no orders", async () => {
    const orderRepository = createOrderRepositoryMock();
    const useCase = new GetMyOrdersUseCase(orderRepository);

    const result = await useCase.execute(userId);

    expect(result).toEqual([]);
  });

  it("should reject an invalid user ID", async () => {
    const orderRepository = createOrderRepositoryMock();
    const useCase = new GetMyOrdersUseCase(orderRepository);

    await expect(useCase.execute(0)).rejects.toThrow("Invalid user ID");

    expect(orderRepository.findByUserId).not.toHaveBeenCalled();
  });
});
