import { Order } from "../../../domain/entities/order.entity.js";
import { OrderItem } from "../../../domain/entities/order-item.entity.js";
import type { OrderRepository } from "../../../domain/repositories/order.repository.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "./client.js";
import { CheckoutConflictError } from "../../../application/errors/checkout-conflict.error.js";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

export class PrismaOrderRepository implements OrderRepository {
  private toDomain(record: OrderWithItems): Order {
    const items = record.items.map(
      (item) =>
        new OrderItem({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toNumber(),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }),
    );

    return new Order({
      id: record.id,
      userId: record.userId,
      items,
      status: record.status,
      paymentStatus: record.paymentStatus,
      totalAmount: record.totalAmount.toNumber(),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findById(id: number): Promise<Order | null> {
    const record = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    return record ? this.toDomain(record) : null;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const records = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => this.toDomain(record));
  }

  async createFromCart(userId: number): Promise<Order> {
    const orderId = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new CheckoutConflictError("Cart is empty");
      }

      const orderItems = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }));

      let totalAmount = 0;

      for (const item of orderItems) {
        const stockUpdate = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (stockUpdate.count !== 1) {
          throw new CheckoutConflictError(
            `Insufficient stock for product ${item.productId}`,
          );
        }

        totalAmount += item.unitPrice.toNumber() * item.quantity;
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return order.id;
    });

    const order = await this.findById(orderId);

    if (!order) {
      throw new Error("Created order could not be retrieved");
    }

    return order;
  }

  async update(order: Order): Promise<Order> {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });

    const updatedOrder = await this.findById(order.id);

    if (!updatedOrder) {
      throw new Error("Updated order could not be retrieved");
    }

    return updatedOrder;
  }
}
