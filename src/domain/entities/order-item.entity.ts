export interface OrderItemProps {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderItem {
  constructor(private readonly props: OrderItemProps) {
    if (!Number.isInteger(props.quantity) || props.quantity < 1) {
      throw new Error("Order item quantity must be a positive integer");
    }

    if (!Number.isFinite(props.unitPrice) || props.unitPrice < 0) {
      throw new Error("Order item unit price must be a non-negative number");
    }
  }

  get id(): number {
    return this.props.id;
  }

  get orderId(): number {
    return this.props.orderId;
  }

  get productId(): number {
    return this.props.productId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get subtotal(): number {
    return this.props.quantity * this.props.unitPrice;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
