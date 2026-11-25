import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { prisma } from "../../src/infrastructure/database/prisma/client.js";
import { PrismaOrderRepository } from "../../src/infrastructure/database/prisma/prisma-order.repository.js";

describe("PrismaOrderRepository Integration", () => {
  const repository = new PrismaOrderRepository();

  const testEmail = `order-repository-${Date.now()}@example.com`;
  const testPassword = "StrongTestPassword123!";

  let userId: number;
  let productId: number;
  let categoryId: number;
  let orderId: number;

  beforeAll(async () => {
    const category = await prisma.category.create({
      data: {
        name: "Order Repository Test Category",
        slug: `order-repository-${Date.now()}`,
      },
    });
    categoryId = category.id;

    const product = await prisma.product.create({
      data: {
        name: "Order Repository Test Product",
        sku: `ORDER-REPO-${Date.now()}`,
        price: 150,
        stock: 10,
        categoryId,
      },
    });
    productId = product.id;

    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: testPassword,
        firstName: "Order",
        lastName: "Test",
      },
    });
    userId = user.id;

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: 300,
        items: {
          create: [
            {
              productId,
              quantity: 2,
              unitPrice: 150,
            },
          ],
        },
      },
    });
    orderId = order.id;
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany({
      where: { order: { userId } },
    });

    await prisma.order.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    await prisma.category.delete({
      where: { id: categoryId },
    });
  });

  it("should find an order by ID", async () => {
    const order = await repository.findById(orderId);

    expect(order).not.toBeNull();
    expect(order?.id).toBe(orderId);
    expect(order?.userId).toBe(userId);
    expect(order?.totalAmount).toBe(300);
    expect(order?.items).toHaveLength(1);
    expect(order?.items[0].quantity).toBe(2);
    expect(order?.items[0].unitPrice).toBe(150);
  });

  it("should return null when order does not exist", async () => {
    const order = await repository.findById(-1);

    expect(order).toBeNull();
  });

  it("should find orders belonging to a user", async () => {
    const orders = await repository.findByUserId(userId);

    expect(orders).toHaveLength(1);
    expect(orders[0].id).toBe(orderId);
    expect(orders[0].userId).toBe(userId);
  });

  it("should return an empty array when user has no orders", async () => {
    const anotherUser = await prisma.user.create({
      data: {
        email: `no-orders-${Date.now()}@example.com`,
        firstName: "No",
        lastName: "Orders",
      },
    });

    try {
      const orders = await repository.findByUserId(anotherUser.id);

      expect(orders).toEqual([]);
    } finally {
      await prisma.user.delete({
        where: { id: anotherUser.id },
      });
    }
  });
});
