import type { Cart } from "../../domain/entities/cart.entity.js";

export interface CartItemResponseDto {
  id: number;
  productId: number;
  quantity: number;
}

export interface CartResponseDto {
  id: number;
  userId: number;
  items: CartItemResponseDto[];
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
}

export function toCartResponseDto(cart: Cart): CartResponseDto {
  return {
    id: cart.id,
    userId: cart.userId,
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
    })),
    totalItems: cart.totalItems,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
}
