import { describe, it, expect, vi } from "vitest";

import { CheckoutUseCase } from "../../../src/application/use-cases/order/checkout.use-case.js";
import type { OrderRepository } from "../../../src/domain/repositories/order.repository.js";

describe("CheckoutUseCase", () => {
  const mockOrderRepository = {
    createFromCart: vi.fn(),
  };

  const useCase = new CheckoutUseCase(
    mockOrderRepository as unknown as OrderRepository,
  );

  it("should create an order from user's cart", async () => {
    const expectedOrder = {
      id: 1,
      userId: 10,
      totalAmount: 300,
    };

    mockOrderRepository.createFromCart.mockResolvedValue(expectedOrder);

    const result = await useCase.execute(10);

    expect(mockOrderRepository.createFromCart).toHaveBeenCalledWith(10);
    expect(result).toEqual(expectedOrder);
  });

  it("should reject invalid user ID", async () => {
    await expect(useCase.execute(0)).rejects.toThrow("Invalid user ID");

    expect(mockOrderRepository.createFromCart).not.toHaveBeenCalled();
  });

  it("should reject negative user ID", async () => {
    await expect(useCase.execute(-1)).rejects.toThrow("Invalid user ID");

    expect(mockOrderRepository.createFromCart).not.toHaveBeenCalled();
  });

  it("should propagate repository errors", async () => {
    mockOrderRepository.createFromCart.mockRejectedValue(
      new Error("Cart is empty"),
    );

    await expect(useCase.execute(10)).rejects.toThrow("Cart is empty");
  });
});
