import { describe, it, expect, vi } from "vitest";

import { GetProductsUseCase } from "../../../src/application/use-cases/product/get-products.use-case.js";

import type { ProductRepository } from "../../../src/domain/repositories/product.repository.js";
import { Product } from "../../../src/domain/entities/product.entity.js";

describe("GetProductsUseCase", () => {
  const products = [
    new Product({
      id: 1,
      name: "iPhone 17",
      description: "Apple smartphone",
      sku: "IPHONE-17",
      price: 59999,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Product({
      id: 2,
      name: "Samsung TV",
      description: "Smart television",
      sku: "SAMSUNG-TV",
      price: 45000,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  const createProductRepositoryMock = (): ProductRepository => ({
    findAll: vi.fn().mockResolvedValue(products),
    count: vi.fn().mockResolvedValue(25),
    findById: vi.fn(),
    findBySku: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  });

  it("should return products with pagination information", async () => {
    const productRepository = createProductRepositoryMock();

    const useCase = new GetProductsUseCase(productRepository);

    const result = await useCase.execute(2, 10);

    expect(result.data).toEqual(products);

    expect(result.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3,
    });

    expect(productRepository.findAll).toHaveBeenCalledWith(10, 10);
    expect(productRepository.count).toHaveBeenCalledTimes(1);
  });

  it("should use default pagination values when no arguments are provided", async () => {
    const productRepository = createProductRepositoryMock();

    const useCase = new GetProductsUseCase(productRepository);

    const result = await useCase.execute();

    expect(productRepository.findAll).toHaveBeenCalledWith(0, 10);

    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it("should return zero total pages when there are no products", async () => {
    const productRepository = createProductRepositoryMock();

    vi.mocked(productRepository.findAll).mockResolvedValue([]);
    vi.mocked(productRepository.count).mockResolvedValue(0);

    const useCase = new GetProductsUseCase(productRepository);

    const result = await useCase.execute(1, 10);

    expect(result.data).toEqual([]);
    expect(result.pagination.totalPages).toBe(0);
  });
});
