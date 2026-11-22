import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/infrastructure/database/prisma/client.js";

describe("RBAC HTTP Integration", () => {
  const testEmail = `rbac-test-${Date.now()}@example.com`;
  const testPassword = "StrongTestPassword123!";
  const testSlug = `rbac-category-${Date.now()}`;
  const testSku = `RBAC-${Date.now()}`;

  let accessToken: string;
  let categoryId: number;

  afterAll(async () => {
    await prisma.product.deleteMany({
      where: { sku: testSku },
    });

    await prisma.category.deleteMany({
      where: { slug: testSlug },
    });

    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
  });

  it("should register a CUSTOMER user", async () => {
    const response = await request(app).post("/auth/register").send({
      email: testEmail,
      password: testPassword,
      firstName: "RBAC",
      lastName: "Test",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.role).toBe("CUSTOMER");
  });

  it("should login and obtain an access token", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeTypeOf("string");

    accessToken = response.body.data.accessToken;
  });

  it("should reject CUSTOMER from creating a category", async () => {
    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "RBAC Test Category",
        slug: testSlug,
      });

    expect(response.status).toBe(403);
  });

  it("should reject CUSTOMER from creating a product", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "RBAC Test Product",
        sku: testSku,
        price: 100,
        categoryId: 1,
      });

    expect(response.status).toBe(403);
  });

  it("should promote the test user to ADMIN", async () => {
    await prisma.user.update({
      where: { email: testEmail },
      data: { role: "ADMIN" },
    });
  });

  it("should allow ADMIN to create a category", async () => {
    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "RBAC Test Category",
        slug: testSlug,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();

    categoryId = response.body.data.id;

    expect(categoryId).toBeTypeOf("number");

    const savedCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    expect(savedCategory).not.toBeNull();
    expect(savedCategory?.slug).toBe(testSlug);
  });

  it("should allow ADMIN to create a product", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "RBAC Test Product",
        sku: testSku,
        price: 100,
        categoryId,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();

    const savedProduct = await prisma.product.findUnique({
      where: { sku: testSku },
    });

    expect(savedProduct).not.toBeNull();
    expect(savedProduct?.sku).toBe(testSku);
  });
});
