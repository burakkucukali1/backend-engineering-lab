import { describe, it, expect } from "vitest";
import { OrderItem } from "../../../src/domain/entities/order-item.entity.js";

describe("OrderItem Entity", () => {
  const createOrderItem = (overrides = {}) =>
    new OrderItem({
      id: 1,
      orderId: 10,
      productId: 20,
      quantity: 2,
      unitPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });

  it("should create an order item", () => {
    const item = createOrderItem();

    expect(item.id).toBe(1);
    expect(item.productId).toBe(20);
    expect(item.quantity).toBe(2);
    expect(item.unitPrice).toBe(100);
  });

  it("should calculate subtotal", () => {
    const item = createOrderItem();

    expect(item.subtotal).toBe(200);
  });

  it("should reject invalid quantity", () => {
    expect(() => createOrderItem({ quantity: 0 })).toThrow(
      "Order item quantity must be a positive integer",
    );
  });

  it("should reject negative unit price", () => {
    expect(() => createOrderItem({ unitPrice: -10 })).toThrow(
      "Order item unit price must be a non-negative number",
    );
  });
});
