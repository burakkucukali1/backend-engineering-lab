import type { Order } from "../../domain/entities/order.entity.js";

export interface OrderItemResponseDto {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponseDto {
  id: number;
  userId: number;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export function toOrderResponseDto(order: Order): OrderResponseDto {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalAmount: order.totalAmount,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
