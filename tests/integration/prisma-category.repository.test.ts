import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { prisma } from "../../src/infrastructure/database/prisma/client.js";
import { PrismaCategoryRepository } from "../../src/infrastructure/database/prisma/prisma-category.repository.js";

describe("PrismaCategoryRepository", () => {
  const categoryRepository = new PrismaCategoryRepository();

  const testSlug = `test-category-${Date.now()}`;
  let categoryId: number;

  beforeAll(async () => {
    const category = await categoryRepository.create({
      name: "Test Category",
      slug: testSlug,
      description: "Integration test category",
    });

    categoryId = category.id;
  });

  afterAll(async () => {
    await prisma.category.deleteMany({
      where: { id: categoryId },
    });
  });

  it("should create a category", async () => {
    const category = await categoryRepository.findById(categoryId);

    expect(category).not.toBeNull();
    expect(category?.name).toBe("Test Category");
    expect(category?.slug).toBe(testSlug);
    expect(category?.description).toBe("Integration test category");
  });

  it("should find a category by slug", async () => {
    const category = await categoryRepository.findBySlug(testSlug);

    expect(category).not.toBeNull();
    expect(category?.slug).toBe(testSlug);
  });

  it("should find a category by ID", async () => {
    const category = await categoryRepository.findById(categoryId);

    expect(category).not.toBeNull();
    expect(category?.id).toBe(categoryId);
  });

  it("should return null when category does not exist", async () => {
    const category = await categoryRepository.findBySlug(
      "non-existent-category",
    );

    expect(category).toBeNull();
  });

  it("should return categories with pagination", async () => {
    const categories = await categoryRepository.findAll(0, 10);

    expect(categories.length).toBeGreaterThan(0);
    expect(categories.some((category) => category.id === categoryId)).toBe(
      true,
    );
  });

  it("should return the total category count", async () => {
    const count = await categoryRepository.count();

    expect(count).toBeGreaterThan(0);
  });

  it("should update a category", async () => {
    const updatedCategory = await categoryRepository.update(categoryId, {
      name: "Updated Test Category",
      description: "Updated integration test category",
    });

    expect(updatedCategory.name).toBe("Updated Test Category");
    expect(updatedCategory.description).toBe(
      "Updated integration test category",
    );
  });
});
