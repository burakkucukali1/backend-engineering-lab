import { describe, it, expect, vi } from "vitest";

import { GetCategoryByIdUseCase } from "../../../src/application/use-cases/category/get-category-by-id.use-case.js";
import { CategoryNotFoundError } from "../../../src/application/errors/category-not-found.error.js";

import type { CategoryRepository } from "../../../src/domain/repositories/category.repository.js";
import { Category } from "../../../src/domain/entities/category.entity.js";

describe("GetCategoryByIdUseCase", () => {
  const categoryId = 1;

  const existingCategory = new Category({
    id: categoryId,
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const createCategoryRepositoryMock = (): CategoryRepository => ({
    findById: vi.fn().mockResolvedValue(existingCategory),
    findBySlug: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  });

  it("should return a category when it exists", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    const useCase = new GetCategoryByIdUseCase(categoryRepository);

    const result = await useCase.execute(categoryId);

    expect(result).toBe(existingCategory);
    expect(categoryRepository.findById).toHaveBeenCalledWith(categoryId);
    expect(categoryRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("should throw CategoryNotFoundError when category does not exist", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(categoryRepository.findById).mockResolvedValue(null);

    const useCase = new GetCategoryByIdUseCase(categoryRepository);

    await expect(useCase.execute(categoryId)).rejects.toThrow(
      CategoryNotFoundError,
    );

    expect(categoryRepository.findById).toHaveBeenCalledWith(categoryId);
  });
});
