import type {
  ProductRepository,
  UpdateProductData,
} from "../../../domain/repositories/product.repository.js";
import type { CategoryRepository } from "../../../domain/repositories/category.repository.js";
import { ProductNotFoundError } from "../../errors/product-not-found.error.js";
import { ProductAlreadyExistsError } from "../../errors/product-already-exists.error.js";
import { CategoryNotFoundError } from "../../errors/category-not-found.error.js";

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: number, data: UpdateProductData) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    if (data.sku && data.sku !== product.sku) {
      const existingProduct = await this.productRepository.findBySku(data.sku);

      if (existingProduct) {
        throw new ProductAlreadyExistsError();
      }
    }

    if (data.categoryId !== undefined) {
      const category = await this.categoryRepository.findById(data.categoryId);

      if (!category) {
        throw new CategoryNotFoundError();
      }
    }

    return this.productRepository.update(id, data);
  }
}
