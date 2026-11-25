import { describe, it, expect } from "vitest";
import { Order } from "../../../src/domain/entities/order.entity.js";
import { OrderItem } from "../../../src/domain/entities/order-item.entity.js";
import { ORDER_STATUS } from "../../../src/domain/enums/order-status.js";
import { PAYMENT_STATUS } from "../../../src/domain/enums/payment-status.js";

describe("Order Entity", () => {
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

  const createOrder = (overrides = {}) =>
    new Order({
      id: 10,
      userId: 5,
      items: [createOrderItem()],
      status: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      totalAmount: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });

  it("should create an order", () => {
    const order = createOrder();

    expect(order.id).toBe(10);
    expect(order.userId).toBe(5);
    expect(order.status).toBe(ORDER_STATUS.PENDING);
    expect(order.paymentStatus).toBe(PAYMENT_STATUS.PENDING);
    expect(order.totalAmount).toBe(200);
  });

  it("should reject an order without items", () => {
    expect(() => createOrder({ items: [] })).toThrow(
      "Order must contain at least one item",
    );
  });

  it("should reject negative total amount", () => {
    expect(() => createOrder({ totalAmount: -100 })).toThrow(
      "Order total amount must be non-negative",
    );
  });

  it("should return a copy of the items array", () => {
    const order = createOrder();
    const items = order.items;

    items.pop();

    expect(order.items).toHaveLength(1);
  });

  it("should allow valid status transition", () => {
    const order = createOrder();

    order.changeStatus(ORDER_STATUS.CONFIRMED);

    expect(order.status).toBe(ORDER_STATUS.CONFIRMED);
  });

  it("should allow order cancellation from pending", () => {
    const order = createOrder();

    order.changeStatus(ORDER_STATUS.CANCELLED);

    expect(order.status).toBe(ORDER_STATUS.CANCELLED);
  });

  it("should reject invalid status transition", () => {
    const order = createOrder();

    expect(() => {
      order.changeStatus(ORDER_STATUS.SHIPPED);
    }).toThrow("Cannot change order status");
  });

  it("should not allow changing delivered orders", () => {
    const order = createOrder({
      status: ORDER_STATUS.DELIVERED,
    });

    expect(() => {
      order.changeStatus(ORDER_STATUS.PROCESSING);
    }).toThrow("Cannot change order status");
  });
});
