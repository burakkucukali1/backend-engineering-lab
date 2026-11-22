import type { CategoryRepository } from "../../../domain/repositories/category.repository.js";

export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.categoryRepository.findAll(skip, limit),
      this.categoryRepository.count(),
    ]);

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
