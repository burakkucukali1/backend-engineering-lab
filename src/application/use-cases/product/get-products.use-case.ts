import type { ProductRepository } from "../../../domain/repositories/product.repository.js";

export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.productRepository.findAll(skip, limit),
      this.productRepository.count(),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
