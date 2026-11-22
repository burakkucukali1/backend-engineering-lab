import type {
  CategoryRepository,
  CreateCategoryData,
} from "../../../domain/repositories/category.repository.js";
import { CategoryAlreadyExistsError } from "../../errors/category-already-exists.error.js";

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(data: CreateCategoryData) {
    const existingCategory = await this.categoryRepository.findBySlug(
      data.slug,
    );

    if (existingCategory) {
      throw new CategoryAlreadyExistsError();
    }

    return this.categoryRepository.create(data);
  }
}
