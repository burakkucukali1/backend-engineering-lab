import type { Category } from "../../domain/entities/category.entity.js";

export function toCategoryResponseDto(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
