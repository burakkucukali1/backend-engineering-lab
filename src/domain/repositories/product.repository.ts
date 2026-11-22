import type { Product } from "../entities/product.entity.js";

export interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  price: number;
  categoryId: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string | null;
  sku?: string;
  price?: number;
  categoryId?: number;
}

export interface ProductRepository {
  create(data: CreateProductData): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(skip: number, take: number): Promise<Product[]>;
  count(): Promise<number>;
  update(id: number, data: UpdateProductData): Promise<Product>;
}
