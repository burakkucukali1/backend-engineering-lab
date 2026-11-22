import { describe, it, expect, vi } from "vitest";

import { UpdateProductUseCase } from "../../../src/application/use-cases/product/update-product.use-case.js";
import { ProductNotFoundError } from "../../../src/application/errors/product-not-found.error.js";
import { ProductAlreadyExistsError } from "../../../src/application/errors/product-already-exists.error.js";
import { CategoryNotFoundError } from "../../../src/application/errors/category-not-found.error.js";

import type { ProductRepository } from "../../../src/domain/repositories/product.repository.js";
import type { CategoryRepository } from "../../../src/domain/repositories/category.repository.js";

import { Product } from "../../../src/domain/entities/product.entity.js";
import { Category } from "../../../src/domain/entities/category.entity.js";

describe("UpdateProductUseCase", () => {
  const productId = 1;

  const existingProduct = new Product({
    id: productId,
    name: "iPhone 17",
    description: "Apple smartphone",
    sku: "IPHONE-17",
    price: 59999,
    categoryId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const createProductRepositoryMock = (): ProductRepository => ({
    findById: vi.fn().mockResolvedValue(existingProduct),
    findBySku: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue(existingProduct),
    create: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
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

  it("should update a product when all validations pass", async () => {
    const productRepository = createProductRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();

    const updateData = {
      name: "iPhone 17 Pro",
      price: 69999,
    };

    const useCase = new UpdateProductUseCase(
      productRepository,
      categoryRepository,
    );

    await useCase.execute(productId, updateData);

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(productRepository.update).toHaveBeenCalledWith(
      productId,
      updateData,
    );
  });

  it("should throw ProductNotFoundError when product does not exist", async () => {
    const productRepository = createProductRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(productRepository.findById).mockResolvedValue(null);

    const useCase = new UpdateProductUseCase(
      productRepository,
      categoryRepository,
    );

    await expect(
      useCase.execute(productId, { name: "New name" }),
    ).rejects.toThrow(ProductNotFoundError);

    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it("should throw ProductAlreadyExistsError when new SKU belongs to another product", async () => {
    const productRepository = createProductRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(productRepository.findBySku).mockResolvedValue(
      new Product({
        id: 2,
        name: "Another product",
        description: null,
        sku: "ANOTHER-SKU",
        price: 45000,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const useCase = new UpdateProductUseCase(
      productRepository,
      categoryRepository,
    );

    await expect(
      useCase.execute(productId, { sku: "ANOTHER-SKU" }),
    ).rejects.toThrow(ProductAlreadyExistsError);

    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it("should not check SKU when SKU remains unchanged", async () => {
    const productRepository = createProductRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();

    const useCase = new UpdateProductUseCase(
      productRepository,
      categoryRepository,
    );

    await useCase.execute(productId, {
      sku: existingProduct.sku,
      name: "Updated iPhone",
    });

    expect(productRepository.findBySku).not.toHaveBeenCalled();
    expect(productRepository.update).toHaveBeenCalled();
  });

  it("should throw CategoryNotFoundError when new category does not exist", async () => {
    const productRepository = createProductRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();

    vi.mocked(categoryRepository.findById).mockResolvedValue(null);

    const useCase = new UpdateProductUseCase(
      productRepository,
      categoryRepository,
    );

    await expect(
      useCase.execute(productId, { categoryId: 99 }),
    ).rejects.toThrow(CategoryNotFoundError);

    expect(productRepository.update).not.toHaveBeenCalled();
  });
});
