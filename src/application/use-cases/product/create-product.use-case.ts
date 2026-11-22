import type {
  ProductRepository,
  CreateProductData,
} from "../../../domain/repositories/product.repository.js";
import type { CategoryRepository } from "../../../domain/repositories/category.repository.js";
import { ProductAlreadyExistsError } from "../../errors/product-already-exists.error.js";
import { CategoryNotFoundError } from "../../errors/category-not-found.error.js";

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(data: CreateProductData) {
    const existingProduct = await this.productRepository.findBySku(data.sku);

    if (existingProduct) {
      throw new ProductAlreadyExistsError();
    }

    const category = await this.categoryRepository.findById(data.categoryId);

    if (!category) {
      throw new CategoryNotFoundError();
    }

    return this.productRepository.create(data);
  }
}
