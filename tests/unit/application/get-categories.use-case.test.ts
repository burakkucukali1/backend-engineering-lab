import { describe, it, expect, vi } from "vitest";

import { GetCategoriesUseCase } from "../../../src/application/use-cases/category/get-categories.use-case.js";

import type { CategoryRepository } from "../../../src/domain/repositories/category.repository.js";
import { Category } from "../../../src/domain/entities/category.entity.js";

describe("GetCategoriesUseCase", () => {
  const categories = [
    new Category({
      id: 1,
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Category({
      id: 2,
      name: "Clothing",
      slug: "clothing",
      description: "Clothing products",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  const createCategoryRepositoryMock = (): CategoryRepository => ({
    findAll: vi.fn().mockResolvedValue(categories),
    count: vi.fn().mockResolvedValue(25),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  });

  it("should return categories with pagination information", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    const useCase = new GetCategoriesUseCase(categoryRepository);

    const result = await useCase.execute(2, 10);

    expect(result.data).toEqual(categories);

    expect(result.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3,
    });

    expect(categoryRepository.findAll).toHaveBeenCalledWith(10, 10);
    expect(categoryRepository.count).toHaveBeenCalledTimes(1);
  });

  it("should use default pagination values when no arguments are provided", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    const useCase = new GetCategoriesUseCase(categoryRepository);

    const result = await useCase.execute();

    expect(categoryRepository.findAll).toHaveBeenCalledWith(0, 10);

    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it("should return zero total pages when there are no categories", async () => {
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(categoryRepository.findAll).mockResolvedValue([]);
    vi.mocked(categoryRepository.count).mockResolvedValue(0);

    const useCase = new GetCategoriesUseCase(categoryRepository);

    const result = await useCase.execute(1, 10);

    expect(result.data).toEqual([]);
    expect(result.pagination.totalPages).toBe(0);
  });
});
