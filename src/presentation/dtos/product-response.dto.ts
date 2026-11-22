import type { Product } from "../../domain/entities/product.entity.js";

export function toProductResponseDto(product: Product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    sku: product.sku,
    price: product.price,
    categoryId: product.categoryId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
