import type { OrderItem } from "./order-item.entity.js";
import type { OrderStatus } from "../enums/order-status.js";
import type { PaymentStatus } from "../enums/payment-status.js";
import { ORDER_STATUS } from "../enums/order-status.js";

export interface OrderProps {
  id: number;
  userId: number;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Order {
  constructor(private readonly props: OrderProps) {
    if (props.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    if (!Number.isFinite(props.totalAmount) || props.totalAmount < 0) {
      throw new Error("Order total amount must be non-negative");
    }
  }

  get id(): number {
    return this.props.id;
  }

  get userId(): number {
    return this.props.userId;
  }

  get items(): OrderItem[] {
    return [...this.props.items];
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get paymentStatus(): PaymentStatus {
    return this.props.paymentStatus;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  changeStatus(nextStatus: OrderStatus): void {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.CONFIRMED]: [
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.CANCELLED,
      ],
      [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
      [ORDER_STATUS.DELIVERED]: [],
      [ORDER_STATUS.CANCELLED]: [],
    };

    if (!allowedTransitions[this.props.status].includes(nextStatus)) {
      throw new Error(
        `Cannot change order status from ${this.props.status} to ${nextStatus}`,
      );
    }

    this.props.status = nextStatus;
  }
}
