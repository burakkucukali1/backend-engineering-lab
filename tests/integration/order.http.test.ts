import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/infrastructure/database/prisma/client.js";

describe("Order HTTP Integration", () => {
  const password = "StrongTestPassword123!";
  const email = `order-http-${Date.now()}@example.com`;
  const secondEmail = `order-http-second-${Date.now()}@example.com`;
  const adminEmail = `order-http-admin-${Date.now()}@example.com`;

  let userId: number;
  let secondUserId: number;
  let adminUserId: number;
  let categoryId: number;
  let productId: number;
  let orderId: number;

  let accessToken: string;
  let secondAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    const category = await prisma.category.create({
      data: {
        name: "Order HTTP Category",
        slug: `order-http-${Date.now()}`,
      },
    });
    categoryId = category.id;

    const product = await prisma.product.create({
      data: {
        name: "Order HTTP Product",
        sku: `ORDER-HTTP-${Date.now()}`,
        price: 100,
        stock: 10,
        categoryId,
      },
    });
    productId = product.id;

    const register = await request(app).post("/auth/register").send({
      email,
      password,
      firstName: "Order",
      lastName: "HTTP",
    });
    expect(register.status).toBe(201);
    userId = register.body.data.id;

    const login = await request(app).post("/auth/login").send({
      email,
      password,
    });
    expect(login.status).toBe(200);
    accessToken = login.body.data.accessToken;

    const secondRegister = await request(app).post("/auth/register").send({
      email: secondEmail,
      password,
      firstName: "Second",
      lastName: "User",
    });
    expect(secondRegister.status).toBe(201);
    secondUserId = secondRegister.body.data.id;

    const secondLogin = await request(app).post("/auth/login").send({
      email: secondEmail,
      password,
    });
    expect(secondLogin.status).toBe(200);
    secondAccessToken = secondLogin.body.data.accessToken;

    const adminRegister = await request(app).post("/auth/register").send({
      email: adminEmail,
      password,
      firstName: "Order",
      lastName: "Admin",
    });
    expect(adminRegister.status).toBe(201);
    adminUserId = adminRegister.body.data.id;

    await prisma.user.update({
      where: { id: adminUserId },
      data: { role: "ADMIN" },
    });

    const adminLogin = await request(app).post("/auth/login").send({
      email: adminEmail,
      password,
    });
    expect(adminLogin.status).toBe(200);
    adminAccessToken = adminLogin.body.data.accessToken;
  });

  afterAll(async () => {
    const userIds = [userId, secondUserId, adminUserId];

    await prisma.orderItem.deleteMany({
      where: { order: { userId: { in: userIds } } },
    });

    await prisma.order.deleteMany({
      where: { userId: { in: userIds } },
    });

    await prisma.cartItem.deleteMany({
      where: { cart: { userId: { in: userIds } } },
    });

    await prisma.cart.deleteMany({
      where: { userId: { in: userIds } },
    });

    await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    await prisma.category.delete({
      where: { id: categoryId },
    });
  });

  async function addProductToCart(quantity: number) {
    const response = await request(app)
      .post("/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ productId, quantity });

    expect(response.status).toBe(200);
  }

  it("should reject unauthenticated order requests", async () => {
    const response = await request(app).get("/orders/me");

    expect(response.status).toBe(401);
  });

  it("should checkout and return the created order", async () => {
    await addProductToCart(2);

    const response = await request(app)
      .post("/orders/checkout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.userId).toBe(userId);
    expect(response.body.data.totalAmount).toBe(200);
    expect(response.body.data.items).toHaveLength(1);

    orderId = response.body.data.id;
  });

  it("should return the user's order history", async () => {
    const response = await request(app)
      .get("/orders/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].id).toBe(orderId);
  });

  it("should return an order by ID", async () => {
    const response = await request(app)
      .get(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(orderId);
  });

  it("should not allow another user to access the order", async () => {
    const response = await request(app)
      .get(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${secondAccessToken}`);

    expect(response.status).toBe(404);
  });

  it("should reject invalid order IDs", async () => {
    const response = await request(app)
      .get("/orders/invalid")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it("should reject checkout when cart is empty", async () => {
    const response = await request(app)
      .post("/orders/checkout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(409);
  });

  it("should prevent customers from updating order status", async () => {
    const response = await request(app)
      .patch(`/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ status: "CONFIRMED" });

    expect(response.status).toBe(403);
  });

  it("should allow admins to update order status", async () => {
    const response = await request(app)
      .patch(`/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminAccessToken}`)
      .send({ status: "CONFIRMED" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(orderId);
    expect(response.body.data.status).toBe("CONFIRMED");
  });

  it("should reject invalid order status values", async () => {
    const response = await request(app)
      .patch(`/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminAccessToken}`)
      .send({ status: "INVALID_STATUS" });

    expect(response.status).toBe(400);
  });

  it("should reject invalid order IDs when updating status", async () => {
    const response = await request(app)
      .patch("/orders/invalid/status")
      .set("Authorization", `Bearer ${adminAccessToken}`)
      .send({ status: "PROCESSING" });

    expect(response.status).toBe(400);
  });
});
