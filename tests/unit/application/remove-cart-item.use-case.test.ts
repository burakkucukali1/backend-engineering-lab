import { describe, it, expect, vi, beforeEach } from "vitest";
import { RemoveCartItemUseCase } from "../../../src/application/use-cases/cart/remove-cart-item.use-case.js";
import type { CartRepository } from "../../../src/domain/repositories/cart.repository.js";
import type { Cart } from "../../../src/domain/entities/cart.entity.js";

describe("RemoveCartItemUseCase", () => {
  let cartRepository: CartRepository;
  let useCase: RemoveCartItemUseCase;

  beforeEach(() => {
    cartRepository = {
      findByUserId: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      deleteItem: vi.fn(),
    };

    useCase = new RemoveCartItemUseCase(cartRepository);
  });

  it("should remove an item from the user's cart", async () => {
    const cart = { id: 10 } as Cart;

    vi.mocked(cartRepository.findByUserId).mockResolvedValue(cart);
    vi.mocked(cartRepository.deleteItem).mockResolvedValue(undefined);

    await useCase.execute({ userId: 5, productId: 20 });

    expect(cartRepository.findByUserId).toHaveBeenCalledWith(5);
    expect(cartRepository.deleteItem).toHaveBeenCalledWith(10, 20);
  });

  it("should throw an error when the user has no cart", async () => {
    vi.mocked(cartRepository.findByUserId).mockResolvedValue(null);

    await expect(useCase.execute({ userId: 5, productId: 20 })).rejects.toThrow(
      "Cart not found",
    );

    expect(cartRepository.deleteItem).not.toHaveBeenCalled();
  });
});
