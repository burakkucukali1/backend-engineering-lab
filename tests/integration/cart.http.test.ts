import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/infrastructure/database/prisma/client.js";

describe("Cart HTTP Integration", () => {
  const testEmail = `cart-test-${Date.now()}@example.com`;
  const secondUserEmail = `cart-second-${Date.now()}@example.com`;
  const testPassword = "StrongTestPassword123!";

  let accessToken: string;
  let secondUserToken: string;

  let productId: number;
  let categoryId: number;

  let userId: number;
  let secondUserId: number;

  beforeAll(async () => {
    // Create test category
    const category = await prisma.category.create({
      data: {
        name: "Cart Test Category",
        slug: `cart-test-${Date.now()}`,
      },
    });

    categoryId = category.id;

    // Create test product
    const product = await prisma.product.create({
      data: {
        name: "Cart Test Product",
        sku: `CART-${Date.now()}`,
        price: 100,
        stock: 10,
        categoryId,
      },
    });

    productId = product.id;

    // Register first user
    const registerResponse = await request(app).post("/auth/register").send({
      email: testEmail,
      password: testPassword,
      firstName: "Cart",
      lastName: "Test",
    });

    expect(registerResponse.status).toBe(201);

    userId = registerResponse.body.data.id;

    // Login first user
    const loginResponse = await request(app).post("/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(loginResponse.status).toBe(200);

    accessToken = loginResponse.body.data.accessToken;

    // Register second user
    const secondRegisterResponse = await request(app)
      .post("/auth/register")
      .send({
        email: secondUserEmail,
        password: testPassword,
        firstName: "Second",
        lastName: "User",
      });

    expect(secondRegisterResponse.status).toBe(201);

    secondUserId = secondRegisterResponse.body.data.id;

    // Login second user
    const secondLoginResponse = await request(app).post("/auth/login").send({
      email: secondUserEmail,
      password: testPassword,
    });

    expect(secondLoginResponse.status).toBe(200);

    secondUserToken = secondLoginResponse.body.data.accessToken;
  });

  // Clean both carts before each test
  beforeEach(async () => {
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: {
            in: [userId, secondUserId],
          },
        },
      },
    });

    await prisma.cart.deleteMany({
      where: {
        userId: {
          in: [userId, secondUserId],
        },
      },
    });
  });

  afterAll(async () => {
    // Clean cart items
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: {
            in: [userId, secondUserId],
          },
        },
      },
    });

    // Clean carts
    await prisma.cart.deleteMany({
      where: {
        userId: {
          in: [userId, secondUserId],
        },
      },
    });

    // Clean users
    await prisma.user.deleteMany({
      where: {
        id: {
          in: [userId, secondUserId],
        },
      },
    });

    // Clean product and category
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  });

  it("should reject unauthenticated cart requests", async () => {
    const response = await request(app).get("/cart");

    expect(response.status).toBe(401);
  });

  it("should return null when the user has no cart", async () => {
    const response = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeNull();
  });

  it("should remove an item from the user's cart", async () => {
    const addResponse = await request(app)
      .post("/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId,
        quantity: 2,
      });

    expect(addResponse.status).toBe(200);

    const deleteResponse = await request(app)
      .delete(`/cart/items/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);

    const getResponse = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.items).toHaveLength(0);
    expect(getResponse.body.data.totalItems).toBe(0);
  });

  it("should increase quantity when the same product is added again", async () => {
    const firstResponse = await request(app)
      .post("/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId,
        quantity: 2,
      });

    expect(firstResponse.status).toBe(200);

    const secondResponse = await request(app)
      .post("/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId,
        quantity: 3,
      });

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.data.items).toHaveLength(1);
    expect(secondResponse.body.data.items[0].quantity).toBe(5);
    expect(secondResponse.body.data.totalItems).toBe(5);
  });

  it("should add a product to the user's cart", async () => {
    const response = await request(app)
      .post("/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId,
        quantity: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].productId).toBe(productId);
    expect(response.body.data.items[0].quantity).toBe(2);
    expect(response.body.data.totalItems).toBe(2);
  });

  it("should return the user's cart", async () => {
    // Arrange: add an item before requesting the cart
    await request(app)
      .post("/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId,
        quantity: 2,
      });

    const response = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].quantity).toBe(2);
    expect(response.body.data.totalItems).toBe(2);
  });

  it("should reject invalid cart item data", async () => {
    const response = await request(app)
      .post("/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId,
        quantity: 0,
      });

    expect(response.status).toBe(400);
  });

  it("should keep carts isolated between different users", async () => {
    // First user adds a product
    const firstUserAddResponse = await request(app)
      .post("/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId,
        quantity: 3,
      });

    expect(firstUserAddResponse.status).toBe(200);

    // Second user should have no cart
    const secondUserGetResponse = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${secondUserToken}`);

    expect(secondUserGetResponse.status).toBe(200);
    expect(secondUserGetResponse.body.data).toBeNull();

    // Second user adds the same product to their own cart
    const secondUserAddResponse = await request(app)
      .post("/cart/items")
      .set("Authorization", `Bearer ${secondUserToken}`)
      .send({
        productId,
        quantity: 5,
      });

    expect(secondUserAddResponse.status).toBe(200);

    // First user's cart must remain unchanged
    const firstUserGetResponse = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(firstUserGetResponse.status).toBe(200);
    expect(firstUserGetResponse.body.data.items).toHaveLength(1);
    expect(firstUserGetResponse.body.data.items[0].quantity).toBe(3);

    // Second user's cart must contain only their own quantity
    const secondUserFinalResponse = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${secondUserToken}`);

    expect(secondUserFinalResponse.status).toBe(200);
    expect(secondUserFinalResponse.body.data.items).toHaveLength(1);
    expect(secondUserFinalResponse.body.data.items[0].quantity).toBe(5);
  });
});
