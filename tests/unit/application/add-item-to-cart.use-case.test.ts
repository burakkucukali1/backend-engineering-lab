import { describe, it, expect, vi } from "vitest";

import { AddItemToCartUseCase } from "../../../src/application/use-cases/cart/add-item-to-cart.use-case.js";
import { ProductNotFoundError } from "../../../src/application/errors/product-not-found.error.js";

import type { CartRepository } from "../../../src/domain/repositories/cart.repository.js";
import type { ProductRepository } from "../../../src/domain/repositories/product.repository.js";

import { Cart } from "../../../src/domain/entities/cart.entity.js";
import { CartItem } from "../../../src/domain/entities/cart-item.entity.js";
import { Product } from "../../../src/domain/entities/product.entity.js";

describe("AddItemToCartUseCase", () => {
  const input = {
    userId: 1,
    productId: 10,
    quantity: 2,
  };

  const product = new Product({
    id: 10,
    name: "iPhone 17",
    description: "Apple smartphone",
    sku: "IPHONE-17",
    price: 59999,
    categoryId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const createCart = (items: CartItem[] = []) =>
    new Cart({
      id: 1,
      userId: 1,
      items,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  const createCartRepositoryMock = (): CartRepository => {
    const cart = createCart();

    return {
      findByUserId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(cart),
      save: vi.fn(async (cartToSave) => cartToSave),
      deleteItem: vi.fn(),
    };
  };

  const createProductRepositoryMock = (): ProductRepository => ({
    findById: vi.fn().mockResolvedValue(product),
    findBySku: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  });

  it("should create a cart when the user does not have one", async () => {
    const cartRepository = createCartRepositoryMock();
    const productRepository = createProductRepositoryMock();

    const useCase = new AddItemToCartUseCase(cartRepository, productRepository);

    await useCase.execute(input);

    expect(cartRepository.findByUserId).toHaveBeenCalledWith(input.userId);
    expect(cartRepository.create).toHaveBeenCalledWith(input.userId);
    expect(cartRepository.save).toHaveBeenCalledOnce();
  });

  it("should add a new item to the cart", async () => {
    const cartRepository = createCartRepositoryMock();
    const productRepository = createProductRepositoryMock();

    const useCase = new AddItemToCartUseCase(cartRepository, productRepository);

    const result = await useCase.execute(input);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].productId).toBe(input.productId);
    expect(result.items[0].quantity).toBe(input.quantity);
  });

  it("should increase quantity when the product already exists in the cart", async () => {
    const existingItem = new CartItem({
      id: 1,
      cartId: 1,
      productId: 10,
      quantity: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const cart = createCart([existingItem]);
    const cartRepository = createCartRepositoryMock();
    const productRepository = createProductRepositoryMock();

    vi.mocked(cartRepository.findByUserId).mockResolvedValue(cart);

    const useCase = new AddItemToCartUseCase(cartRepository, productRepository);

    const result = await useCase.execute(input);

    expect(cartRepository.create).not.toHaveBeenCalled();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(5);
    expect(cartRepository.save).toHaveBeenCalledOnce();
  });

  it("should throw ProductNotFoundError when the product does not exist", async () => {
    const cartRepository = createCartRepositoryMock();
    const productRepository = createProductRepositoryMock();

    vi.mocked(productRepository.findById).mockResolvedValue(null);

    const useCase = new AddItemToCartUseCase(cartRepository, productRepository);

    await expect(useCase.execute(input)).rejects.toThrow(ProductNotFoundError);

    expect(cartRepository.findByUserId).not.toHaveBeenCalled();
    expect(cartRepository.create).not.toHaveBeenCalled();
    expect(cartRepository.save).not.toHaveBeenCalled();
  });

  it("should find the requested product before accessing the cart", async () => {
    const cartRepository = createCartRepositoryMock();
    const productRepository = createProductRepositoryMock();

    const useCase = new AddItemToCartUseCase(cartRepository, productRepository);

    await useCase.execute(input);

    expect(productRepository.findById).toHaveBeenCalledWith(input.productId);
  });
});
