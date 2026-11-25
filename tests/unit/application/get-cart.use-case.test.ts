import { describe, it, expect, vi } from "vitest";
import { GetCartUseCase } from "../../../src/application/use-cases/cart/get-cart.use-case.js";
import type { CartRepository } from "../../../src/domain/repositories/cart.repository.js";
import { Cart } from "../../../src/domain/entities/cart.entity.js";

describe("GetCartUseCase", () => {
  const createCartRepositoryMock = (): CartRepository => ({
    findByUserId: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    deleteItem: vi.fn(),
  });

  it("should return the user's cart when it exists", async () => {
    const cartRepository = createCartRepositoryMock();

    const cart = new Cart({
      id: 1,
      userId: 1,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(cartRepository.findByUserId).mockResolvedValue(cart);

    const useCase = new GetCartUseCase(cartRepository);
    const result = await useCase.execute(1);

    expect(result).toBe(cart);
    expect(cartRepository.findByUserId).toHaveBeenCalledWith(1);
  });

  it("should return null when the user has no cart", async () => {
    const cartRepository = createCartRepositoryMock();

    vi.mocked(cartRepository.findByUserId).mockResolvedValue(null);

    const useCase = new GetCartUseCase(cartRepository);
    const result = await useCase.execute(1);

    expect(result).toBeNull();
    expect(cartRepository.findByUserId).toHaveBeenCalledWith(1);
  });
});
