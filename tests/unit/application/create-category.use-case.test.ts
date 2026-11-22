import { describe, it, expect, vi } from "vitest";

import { CreateCategoryUseCase } from "../../../src/application/use-cases/category/create-category.use-case.js";
import { CategoryAlreadyExistsError } from "../../../src/application/errors/category-already-exists.error.js";

import type { CategoryRepository } from "../../../src/domain/repositories/category.repository.js";
import { Category } from "../../../src/domain/entities/category.entity.js";

describe("CreateCategoryUseCase", () => {
  const createCategoryData = {
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices",
  };

  const existingCategory = new Category({
    id: 1,
    ...createCategoryData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const createCategoryRepositoryMock = (): CategoryRepository => ({
    findBySlug: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(existingCategory),
    findById: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  });

  it("should create a category when slug does not exist", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    const useCase = new CreateCategoryUseCase(categoryRepository);

    const result = await useCase.execute(createCategoryData);

    expect(result).toBe(existingCategory);
    expect(categoryRepository.findBySlug).toHaveBeenCalledWith(
      createCategoryData.slug,
    );
    expect(categoryRepository.create).toHaveBeenCalledWith(createCategoryData);
  });

  it("should throw CategoryAlreadyExistsError when slug already exists", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(categoryRepository.findBySlug).mockResolvedValue(
      existingCategory,
    );

    const useCase = new CreateCategoryUseCase(categoryRepository);

    await expect(useCase.execute(createCategoryData)).rejects.toThrow(
      CategoryAlreadyExistsError,
    );

    expect(categoryRepository.create).not.toHaveBeenCalled();
  });
});
