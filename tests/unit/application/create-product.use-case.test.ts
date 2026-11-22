import { describe, it, expect, vi } from "vitest";

import { CreateProductUseCase } from "../../../src/application/use-cases/product/create-product.use-case.js";
import { ProductAlreadyExistsError } from "../../../src/application/errors/product-already-exists.error.js";
import { CategoryNotFoundError } from "../../../src/application/errors/category-not-found.error.js";

import type { ProductRepository } from "../../../src/domain/repositories/product.repository.js";
import type { CategoryRepository } from "../../../src/domain/repositories/category.repository.js";

import { Product } from "../../../src/domain/entities/product.entity.js";
import { Category } from "../../../src/domain/entities/category.entity.js";

describe("CreateProductUseCase", () => {
  const createProductData = {
    name: "iPhone 17",
    description: "Apple smartphone",
    sku: "IPHONE-17",
    price: 59999,
    categoryId: 1,
  };

  const createProductRepositoryMock = (): ProductRepository => ({
    findBySku: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(
      new Product({
        id: 1,
        ...createProductData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    findById: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  });

  const createCategoryRepositoryMock = (): CategoryRepository => ({
    findById: vi.fn().mockResolvedValue(
      new Category({
        id: 1,
        name: "Electronics",
        slug: "electronics",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    create: vi.fn(),
    findBySlug: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  });

  it("should create a product when SKU and category are valid", async () => {
    const productRepository = createProductRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();

    const useCase = new CreateProductUseCase(
      productRepository,
      categoryRepository,
    );

    const result = await useCase.execute(createProductData);

    expect(result.name).toBe(createProductData.name);
    expect(productRepository.findBySku).toHaveBeenCalledWith(
      createProductData.sku,
    );
    expect(categoryRepository.findById).toHaveBeenCalledWith(
      createProductData.categoryId,
    );
    expect(productRepository.create).toHaveBeenCalledWith(createProductData);
  });

  it("should throw ProductAlreadyExistsError when SKU already exists", async () => {
    const productRepository = createProductRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(productRepository.findBySku).mockResolvedValue(
      new Product({
        id: 1,
        ...createProductData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const useCase = new CreateProductUseCase(
      productRepository,
      categoryRepository,
    );

    await expect(useCase.execute(createProductData)).rejects.toThrow(
      ProductAlreadyExistsError,
    );

    expect(categoryRepository.findById).not.toHaveBeenCalled();
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it("should throw CategoryNotFoundError when category does not exist", async () => {
    const productRepository = createProductRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(categoryRepository.findById).mockResolvedValue(null);

    const useCase = new CreateProductUseCase(
      productRepository,
      categoryRepository,
    );

    await expect(useCase.execute(createProductData)).rejects.toThrow(
      CategoryNotFoundError,
    );

    expect(productRepository.create).not.toHaveBeenCalled();
  });
});
