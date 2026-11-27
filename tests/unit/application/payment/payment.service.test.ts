import { describe, it, expect, vi } from "vitest";

import { PaymentService } from "../../../../src/application/payment/payment.service.js";
import { CreditCardStrategy } from "../../../../src/application/payment/credit-card.strategy.js";
import { PayPalStrategy } from "../../../../src/application/payment/paypal.strategy.js";

describe("PaymentService", () => {
  it("should process payment using CreditCardStrategy", async () => {
    const strategy = new CreditCardStrategy();
    const paySpy = vi.spyOn(strategy, "pay");

    const service = new PaymentService(strategy);

    await service.processPayment(1500);

    expect(paySpy).toHaveBeenCalledWith(1500);
    expect(paySpy).toHaveBeenCalledTimes(1);
  });

  it("should process payment using PayPalStrategy", async () => {
    const strategy = new PayPalStrategy();
    const paySpy = vi.spyOn(strategy, "pay");

    const service = new PaymentService(strategy);

    await service.processPayment(2500);

    expect(paySpy).toHaveBeenCalledWith(2500);
    expect(paySpy).toHaveBeenCalledTimes(1);
  });

  it("should reject invalid Credit Card payment amounts", async () => {
    const service = new PaymentService(new CreditCardStrategy());

    await expect(service.processPayment(0)).rejects.toThrow(
      "Invalid payment amount",
    );
  });

  it("should reject invalid PayPal payment amounts", async () => {
    const service = new PaymentService(new PayPalStrategy());

    await expect(service.processPayment(-100)).rejects.toThrow(
      "Invalid payment amount",
    );
  });
});
