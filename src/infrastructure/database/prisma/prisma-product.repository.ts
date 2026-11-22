import type {
  ProductRepository,
  CreateProductData,
  UpdateProductData,
} from "../../../domain/repositories/product.repository.js";
import { Product } from "../../../domain/entities/product.entity.js";
import { prisma } from "./client.js";

export class PrismaProductRepository implements ProductRepository {
  private toDomain(record: {
    id: number;
    name: string;
    description: string | null;
    sku: string;
    price: { toNumber(): number };
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return new Product({
      id: record.id,
      name: record.name,
      description: record.description,
      sku: record.sku,
      price: record.price.toNumber(),
      categoryId: record.categoryId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async create(data: CreateProductData): Promise<Product> {
    const record = await prisma.product.create({
      data,
    });

    return this.toDomain(record);
  }

  async findById(id: number): Promise<Product | null> {
    const record = await prisma.product.findUnique({
      where: { id },
    });

    return record ? this.toDomain(record) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const record = await prisma.product.findUnique({
      where: { sku },
    });

    return record ? this.toDomain(record) : null;
  }

  async findAll(skip: number, take: number): Promise<Product[]> {
    const records = await prisma.product.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => this.toDomain(record));
  }

  async count(): Promise<number> {
    return prisma.product.count();
  }

  async update(id: number, data: UpdateProductData): Promise<Product> {
    const record = await prisma.product.update({
      where: { id },
      data,
    });

    return this.toDomain(record);
  }
}
