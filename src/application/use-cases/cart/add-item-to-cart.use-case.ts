import type { CartRepository } from "../../../domain/repositories/cart.repository.js";
import type { ProductRepository } from "../../../domain/repositories/product.repository.js";
import { CartItem } from "../../../domain/entities/cart-item.entity.js";
import { ProductNotFoundError } from "../../errors/product-not-found.error.js";

export interface AddItemToCartInput {
  userId: number;
  productId: number;
  quantity: number;
}

export class AddItemToCartUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: AddItemToCartInput) {
    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new ProductNotFoundError();
    }

    let cart = await this.cartRepository.findByUserId(input.userId);

    if (!cart) {
      cart = await this.cartRepository.create(input.userId);
    }

    const cartItem = new CartItem({
      id: 0,
      cartId: cart.id,
      productId: product.id,
      quantity: input.quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    cart.addItem(cartItem);

    return this.cartRepository.save(cart);
  }
}
