import type {
  CategoryRepository,
  CreateCategoryData,
  UpdateCategoryData,
} from "../../../domain/repositories/category.repository.js";
import { Category } from "../../../domain/entities/category.entity.js";
import { prisma } from "./client.js";

export class PrismaCategoryRepository implements CategoryRepository {
  private toDomain(record: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Category {
    return new Category({
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const record = await prisma.category.create({
      data,
    });

    return this.toDomain(record);
  }

  async findById(id: number): Promise<Category | null> {
    const record = await prisma.category.findUnique({
      where: { id },
    });

    return record ? this.toDomain(record) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const record = await prisma.category.findUnique({
      where: { slug },
    });

    return record ? this.toDomain(record) : null;
  }

  async findAll(skip: number, take: number): Promise<Category[]> {
    const records = await prisma.category.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => this.toDomain(record));
  }

  async count(): Promise<number> {
    return prisma.category.count();
  }

  async update(id: number, data: UpdateCategoryData): Promise<Category> {
    const record = await prisma.category.update({
      where: { id },
      data,
    });

    return this.toDomain(record);
  }
}
