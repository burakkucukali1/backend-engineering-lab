import { describe, it, expect } from "vitest";

import { PaymentFactory } from "../../../../src/application/payment/payment.factory.js";
import { PAYMENT_METHOD } from "../../../../src/application/payment/payment-method.js";

import { CreditCardStrategy } from "../../../../src/application/payment/credit-card.strategy.js";
import { PayPalAdapter } from "../../../../src/application/payment/paypal.adapter.js";

describe("PaymentFactory", () => {
  it("should create CreditCardStrategy", () => {
    const strategy = PaymentFactory.create(PAYMENT_METHOD.CREDIT_CARD);

    expect(strategy).toBeInstanceOf(CreditCardStrategy);
  });

  it("should create PayPalAdapter", () => {
    const strategy = PaymentFactory.create(PAYMENT_METHOD.PAYPAL);

    expect(strategy).toBeInstanceOf(PayPalAdapter);
  });
});
