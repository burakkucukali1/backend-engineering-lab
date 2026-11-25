import type { CartRepository } from "../../../domain/repositories/cart.repository.js";

export interface RemoveCartItemInput {
  userId: number;
  productId: number;
}

export class RemoveCartItemUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(input: RemoveCartItemInput): Promise<void> {
    const cart = await this.cartRepository.findByUserId(input.userId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    await this.cartRepository.deleteItem(cart.id, input.productId);
  }
}
