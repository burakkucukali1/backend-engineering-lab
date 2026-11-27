import type { PaymentStrategy } from "./payment-strategy.js";

export class PaymentService {
  constructor(private readonly paymentStrategy: PaymentStrategy) {}

  async processPayment(amount: number): Promise<void> {
    await this.paymentStrategy.pay(amount);
  }
}
