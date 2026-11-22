import type { CategoryRepository } from "../../../domain/repositories/category.repository.js";
import { CategoryNotFoundError } from "../../errors/category-not-found.error.js";

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new CategoryNotFoundError();
    }

    return category;
  }
}
