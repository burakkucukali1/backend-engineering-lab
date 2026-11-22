import { describe, it, expect, afterAll } from "vitest";

import { prisma } from "../../src/infrastructure/database/prisma/client.js";
import { PrismaProductRepository } from "../../src/infrastructure/database/prisma/prisma-product.repository.js";

describe("PrismaProductRepository", () => {
  const productRepository = new PrismaProductRepository();

  const testSku = `TEST-${Date.now()}`;
  let categoryId: number;

  afterAll(async () => {
    await prisma.product.deleteMany({
      where: { sku: testSku },
    });

    if (categoryId) {
      await prisma.category.deleteMany({
        where: { id: categoryId },
      });
    }

    await prisma.$disconnect();
  });

  it("should create a product", async () => {
    const category = await prisma.category.create({
      data: {
        name: "Test Electronics",
        slug: `test-electronics-${Date.now()}`,
      },
    });

    categoryId = category.id;

    const product = await productRepository.create({
      name: "Test iPhone",
      description: "Integration test product",
      sku: testSku,
      price: 59999,
      categoryId,
    });

    expect(product.id).toBeGreaterThan(0);
    expect(product.name).toBe("Test iPhone");
    expect(product.sku).toBe(testSku);
    expect(product.price).toBe(59999);
    expect(product.categoryId).toBe(categoryId);
  });

  it("should find a product by SKU", async () => {
    const product = await productRepository.findBySku(testSku);

    expect(product).not.toBeNull();
    expect(product?.sku).toBe(testSku);
  });

  it("should find a product by ID", async () => {
    const createdProduct = await productRepository.findBySku(testSku);

    expect(createdProduct).not.toBeNull();

    const product = await productRepository.findById(createdProduct!.id);

    expect(product).not.toBeNull();
    expect(product?.id).toBe(createdProduct!.id);
  });

  it("should return null when product does not exist", async () => {
    const product = await productRepository.findBySku("NON-EXISTENT-SKU");

    expect(product).toBeNull();
  });
});
