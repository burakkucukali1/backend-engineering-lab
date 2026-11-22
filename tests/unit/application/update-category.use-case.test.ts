import { describe, it, expect, vi } from "vitest";

import { UpdateCategoryUseCase } from "../../../src/application/use-cases/category/update-category.use-case.js";
import { CategoryNotFoundError } from "../../../src/application/errors/category-not-found.error.js";
import { CategoryAlreadyExistsError } from "../../../src/application/errors/category-already-exists.error.js";

import type { CategoryRepository } from "../../../src/domain/repositories/category.repository.js";
import { Category } from "../../../src/domain/entities/category.entity.js";

describe("UpdateCategoryUseCase", () => {
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
    findBySlug: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue(existingCategory),
    create: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
  });

  it("should update a category when all validations pass", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    const updateData = {
      name: "Consumer Electronics",
      description: "Updated description",
    };

    const useCase = new UpdateCategoryUseCase(categoryRepository);

    await useCase.execute(categoryId, updateData);

    expect(categoryRepository.findById).toHaveBeenCalledWith(categoryId);
    expect(categoryRepository.update).toHaveBeenCalledWith(
      categoryId,
      updateData,
    );
  });

  it("should throw CategoryNotFoundError when category does not exist", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(categoryRepository.findById).mockResolvedValue(null);

    const useCase = new UpdateCategoryUseCase(categoryRepository);

    await expect(
      useCase.execute(categoryId, { name: "New category" }),
    ).rejects.toThrow(CategoryNotFoundError);

    expect(categoryRepository.update).not.toHaveBeenCalled();
  });

  it("should throw CategoryAlreadyExistsError when new slug belongs to another category", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(categoryRepository.findBySlug).mockResolvedValue(
      new Category({
        id: 2,
        name: "Another Category",
        slug: "another-category",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const useCase = new UpdateCategoryUseCase(categoryRepository);

    await expect(
      useCase.execute(categoryId, { slug: "another-category" }),
    ).rejects.toThrow(CategoryAlreadyExistsError);

    expect(categoryRepository.update).not.toHaveBeenCalled();
  });

  it("should not check slug when slug remains unchanged", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    const useCase = new UpdateCategoryUseCase(categoryRepository);

    await useCase.execute(categoryId, {
      slug: existingCategory.slug,
      name: "Updated Electronics",
    });

    expect(categoryRepository.findBySlug).not.toHaveBeenCalled();
    expect(categoryRepository.update).toHaveBeenCalled();
  });
});
