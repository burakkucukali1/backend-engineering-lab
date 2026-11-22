import type {
  CategoryRepository,
  UpdateCategoryData,
} from "../../../domain/repositories/category.repository.js";
import { CategoryNotFoundError } from "../../errors/category-not-found.error.js";
import { CategoryAlreadyExistsError } from "../../errors/category-already-exists.error.js";

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number, data: UpdateCategoryData) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new CategoryNotFoundError();
    }

    if (data.slug && data.slug !== category.slug) {
      const existingCategory = await this.categoryRepository.findBySlug(
        data.slug,
      );

      if (existingCategory) {
        throw new CategoryAlreadyExistsError();
      }
    }

    return this.categoryRepository.update(id, data);
  }
}
