import { PAYMENT_METHOD } from "./payment-method.js";
import type { PaymentMethod } from "./payment-method.js";

import type { PaymentStrategy } from "./payment-strategy.js";
import { CreditCardStrategy } from "./credit-card.strategy.js";
import { ExternalPayPalSDK } from "./external-paypal-sdk.js";
import { PayPalAdapter } from "./paypal.adapter.js";

export class PaymentFactory {
  static create(method: PaymentMethod): PaymentStrategy {
    switch (method) {
      case PAYMENT_METHOD.CREDIT_CARD:
        return new CreditCardStrategy();

      case PAYMENT_METHOD.PAYPAL:
        return new PayPalAdapter(new ExternalPayPalSDK());

      default: {
        const exhaustiveCheck: never = method;
        throw new Error(`Unsupported payment method: ${exhaustiveCheck}`);
      }
    }
  }
}
