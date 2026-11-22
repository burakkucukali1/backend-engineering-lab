import { describe, it, expect, vi } from "vitest";

import { GetProductByIdUseCase } from "../../../src/application/use-cases/product/get-product-by-id.use-case.js";
import { ProductNotFoundError } from "../../../src/application/errors/product-not-found.error.js";

import type { ProductRepository } from "../../../src/domain/repositories/product.repository.js";
import { Product } from "../../../src/domain/entities/product.entity.js";

describe("GetProductByIdUseCase", () => {
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
    findBySku: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  });

  it("should return a product when it exists", async () => {
    const productRepository = createProductRepositoryMock();

    const useCase = new GetProductByIdUseCase(productRepository);

    const result = await useCase.execute(productId);

    expect(result).toBe(existingProduct);
    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(productRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("should throw ProductNotFoundError when product does not exist", async () => {
    const productRepository = createProductRepositoryMock();

    vi.mocked(productRepository.findById).mockResolvedValue(null);

    const useCase = new GetProductByIdUseCase(productRepository);

    await expect(useCase.execute(productId)).rejects.toThrow(
      ProductNotFoundError,
    );

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
  });
});
