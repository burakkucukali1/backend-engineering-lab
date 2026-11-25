import type { CartRepository } from "../../../domain/repositories/cart.repository.js";

export class GetCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(userId: number) {
    return this.cartRepository.findByUserId(userId);
  }
}
