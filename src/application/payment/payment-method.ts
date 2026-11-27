export const PAYMENT_METHOD = {
  CREDIT_CARD: "CREDIT_CARD",
  PAYPAL: "PAYPAL",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
