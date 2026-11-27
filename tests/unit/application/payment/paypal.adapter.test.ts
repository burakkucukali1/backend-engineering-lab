import { describe, it, expect, vi } from "vitest";

import { PayPalAdapter } from "../../../../src/application/payment/paypal.adapter.js";
import { ExternalPayPalSDK } from "../../../../src/application/payment/external-paypal-sdk.js";

describe("PayPalAdapter", () => {
  it("should convert amount to cents and call external SDK", async () => {
    const sdk = new ExternalPayPalSDK();

    const createOrderSpy = vi.spyOn(sdk, "createOrder").mockResolvedValue({
      transactionId: "PAYPAL-123",
      status: "COMPLETED",
    });

    const adapter = new PayPalAdapter(sdk);

    await adapter.pay(1500);

    expect(createOrderSpy).toHaveBeenCalledWith({
      valueInCents: 150000,
      currencyCode: "TRY",
    });
  });

  it("should reject invalid payment amounts", async () => {
    const sdk = new ExternalPayPalSDK();
    const adapter = new PayPalAdapter(sdk);

    await expect(adapter.pay(0)).rejects.toThrow("Invalid payment amount");
  });

  it("should reject unsuccessful external payments", async () => {
    const sdk = new ExternalPayPalSDK();

    vi.spyOn(sdk, "createOrder").mockResolvedValue({
      transactionId: "PAYPAL-123",
      status: "COMPLETED",
    });

    const adapter = new PayPalAdapter(sdk);

    await expect(adapter.pay(-100)).rejects.toThrow("Invalid payment amount");
  });
});
