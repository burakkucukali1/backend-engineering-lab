import { CartItem } from "./cart-item.entity.js";

export interface CartProps {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export class Cart {
  constructor(private readonly props: CartProps) {}

  get id(): number {
    return this.props.id;
  }

  get userId(): number {
    return this.props.userId;
  }

  get items(): CartItem[] {
    return [...this.props.items];
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get totalItems(): number {
    return this.props.items.reduce((total, item) => total + item.quantity, 0);
  }

  addItem(item: CartItem): void {
    const existingItem = this.props.items.find(
      (currentItem) => currentItem.productId === item.productId,
    );

    if (existingItem) {
      existingItem.increaseQuantity(item.quantity);
      return;
    }

    this.props.items.push(item);
  }

  removeItem(productId: number): void {
    this.props.items = this.props.items.filter(
      (item) => item.productId !== productId,
    );
  }

  clear(): void {
    this.props.items = [];
  }
}
