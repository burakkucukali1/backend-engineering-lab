import { Cart } from "../entities/cart.entity.js";

export interface CartRepository {
  findByUserId(userId: number): Promise<Cart | null>;

  create(userId: number): Promise<Cart>;

  save(cart: Cart): Promise<Cart>;

  deleteItem(cartId: number, productId: number): Promise<void>;
}
