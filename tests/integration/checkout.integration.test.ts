import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";

import { prisma } from "../../src/infrastructure/database/prisma/client.js";
import { PrismaOrderRepository } from "../../src/infrastructure/database/prisma/prisma-order.repository.js";

describe("Checkout Integration", () => {
  const repository = new PrismaOrderRepository();

  const email = `checkout-${Date.now()}@example.com`;

  let userId: number;
  let categoryId: number;
  let productId: number;

  beforeAll(async () => {
    const category = await prisma.category.create({
      data: {
        name: "Checkout Test Category",
        slug: `checkout-${Date.now()}`,
      },
    });
    categoryId = category.id;

    const product = await prisma.product.create({
      data: {
        name: "Checkout Test Product",
        sku: `CHECKOUT-${Date.now()}`,
        price: 100,
        stock: 10,
        categoryId,
      },
    });
    productId = product.id;

    const user = await prisma.user.create({
      data: {
        email,
        firstName: "Checkout",
        lastName: "Test",
      },
    });
    userId = user.id;
  });

  beforeEach(async () => {
    await prisma.orderItem.deleteMany({
      where: { order: { userId } },
    });

    await prisma.order.deleteMany({
      where: { userId },
    });

    await prisma.cartItem.deleteMany({
      where: { cart: { userId } },
    });

    await prisma.cart.deleteMany({
      where: { userId },
    });

    await prisma.product.update({
      where: { id: productId },
      data: { stock: 10 },
    });
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany({
      where: { order: { userId } },
    });

    await prisma.order.deleteMany({
      where: { userId },
    });

    await prisma.cartItem.deleteMany({
      where: { cart: { userId } },
    });

    await prisma.cart.deleteMany({
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

  async function createCart(quantity: number) {
    const cart = await prisma.cart.create({
      data: { userId },
    });

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    return cart;
  }

  it("should create an order and decrease stock", async () => {
    await createCart(3);

    const order = await repository.createFromCart(userId);

    expect(order.userId).toBe(userId);
    expect(order.totalAmount).toBe(300);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].quantity).toBe(3);
    expect(order.items[0].unitPrice).toBe(100);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    expect(product?.stock).toBe(7);

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    expect(cart?.items).toHaveLength(0);
  });

  it("should reject checkout when cart is empty", async () => {
    await expect(repository.createFromCart(userId)).rejects.toThrow(
      "Cart is empty",
    );

    const orders = await prisma.order.findMany({
      where: { userId },
    });

    expect(orders).toHaveLength(0);
  });

  it("should rollback everything when stock is insufficient", async () => {
    await createCart(15);

    await expect(repository.createFromCart(userId)).rejects.toThrow(
      `Insufficient stock for product ${productId}`,
    );

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    expect(product?.stock).toBe(10);

    const orders = await prisma.order.findMany({
      where: { userId },
    });

    expect(orders).toHaveLength(0);

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    expect(cart?.items).toHaveLength(1);
    expect(cart?.items[0].quantity).toBe(15);
  });
});
