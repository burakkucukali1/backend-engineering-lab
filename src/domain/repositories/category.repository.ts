import type { Category } from "../entities/category.entity.js";

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string | null;
}

export interface CategoryRepository {
  create(data: CreateCategoryData): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findAll(skip: number, take: number): Promise<Category[]>;
  count(): Promise<number>;
  update(id: number, data: UpdateCategoryData): Promise<Category>;
}
