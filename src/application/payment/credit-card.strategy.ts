import type { PaymentStrategy } from "./payment-strategy.js";

export class CreditCardStrategy implements PaymentStrategy {
  async pay(amount: number): Promise<void> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    console.log(`Processing credit card payment: ${amount}`);
  }
}
