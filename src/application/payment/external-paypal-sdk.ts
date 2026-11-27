export interface ExternalPayPalOrder {
  valueInCents: number;
  currencyCode: string;
}

export interface ExternalPayPalResult {
  transactionId: string;
  status: "COMPLETED";
}

export class ExternalPayPalSDK {
  async createOrder(order: ExternalPayPalOrder): Promise<ExternalPayPalResult> {
    console.log(
      `External PayPal payment: ${order.valueInCents} ${order.currencyCode}`,
    );

    return {
      transactionId: "PAYPAL-123",
      status: "COMPLETED",
    };
  }
}
