export interface CartItemProps {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CartItem {
  constructor(private readonly props: CartItemProps) {
    if (!Number.isInteger(props.quantity) || props.quantity < 1) {
      throw new Error("Cart item quantity must be a positive integer");
    }
  }

  get id(): number {
    return this.props.id;
  }

  get cartId(): number {
    return this.props.cartId;
  }

  get productId(): number {
    return this.props.productId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  increaseQuantity(amount = 1): void {
    if (!Number.isInteger(amount) || amount < 1) {
      throw new Error("Increase amount must be a positive integer");
    }

    this.props.quantity += amount;
  }

  decreaseQuantity(amount = 1): void {
    if (!Number.isInteger(amount) || amount < 1) {
      throw new Error("Decrease amount must be a positive integer");
    }

    if (this.props.quantity - amount < 1) {
      throw new Error("Cart item quantity cannot be less than 1");
    }

    this.props.quantity -= amount;
  }
}
