import type { CartRepository } from "../../../domain/repositories/cart.repository.js";
import { Cart } from "../../../domain/entities/cart.entity.js";
import { CartItem } from "../../../domain/entities/cart-item.entity.js";
import { prisma } from "./client.js";

export class PrismaCartRepository implements CartRepository {
  private toDomain(record: {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
  }): CartItem {
    return new CartItem({
      id: record.id,
      cartId: record.cartId,
      productId: record.productId,
      quantity: record.quantity,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private cartToDomain(record: {
    id: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    items: {
      id: number;
      cartId: number;
      productId: number;
      quantity: number;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }): Cart {
    return new Cart({
      id: record.id,
      userId: record.userId,
      items: record.items.map((item) => this.toDomain(item)),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByUserId(userId: number): Promise<Cart | null> {
    const record = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    return record ? this.cartToDomain(record) : null;
  }

  async create(userId: number): Promise<Cart> {
    const record = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });

    return this.cartToDomain(record);
  }

  async save(cart: Cart): Promise<Cart> {
    await prisma.$transaction(async (tx) => {
      const existingItems = await tx.cartItem.findMany({
        where: { cartId: cart.id },
      });

      const existingProductIds = existingItems.map((item) => item.productId);

      const currentItems = cart.items;
      const currentProductIds = currentItems.map((item) => item.productId);

      const itemsToDelete = existingProductIds.filter(
        (productId) => !currentProductIds.includes(productId),
      );

      if (itemsToDelete.length > 0) {
        await tx.cartItem.deleteMany({
          where: {
            cartId: cart.id,
            productId: { in: itemsToDelete },
          },
        });
      }

      for (const item of currentItems) {
        if (existingProductIds.includes(item.productId)) {
          await tx.cartItem.update({
            where: {
              cartId_productId: {
                cartId: cart.id,
                productId: item.productId,
              },
            },
            data: { quantity: item.quantity },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }
      }
    });

    const savedCart = await this.findByUserId(cart.userId);

    if (!savedCart) {
      throw new Error("Cart could not be found after saving.");
    }

    return savedCart;
  }

  async deleteItem(cartId: number, productId: number): Promise<void> {
    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }
}
