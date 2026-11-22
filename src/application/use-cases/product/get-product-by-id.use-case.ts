import type { ProductRepository } from "../../../domain/repositories/product.repository.js";
import { ProductNotFoundError } from "../../errors/product-not-found.error.js";

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    return product;
  }
}
