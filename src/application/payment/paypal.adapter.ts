import type { PaymentStrategy } from "./payment-strategy.js";
import { ExternalPayPalSDK } from "./external-paypal-sdk.js";

export class PayPalAdapter implements PaymentStrategy {
  constructor(private readonly paypalSDK: ExternalPayPalSDK) {}

  async pay(amount: number): Promise<void> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    const valueInCents = Math.round(amount * 100);

    const result = await this.paypalSDK.createOrder({
      valueInCents,
      currencyCode: "TRY",
    });

    if (result.status !== "COMPLETED") {
      throw new Error("PayPal payment failed");
    }

    console.log(`Payment completed: ${result.transactionId}`);
  }
}
