import { PaymentService } from "./payment.service.js";
import { PaymentFactory } from "./payment.factory.js";
import { PAYMENT_METHOD } from "./payment-method.js";

async function main(): Promise<void> {
  const creditCardStrategy = PaymentFactory.create(PAYMENT_METHOD.CREDIT_CARD);

  const creditCardPayment = new PaymentService(creditCardStrategy);

  await creditCardPayment.processPayment(1500);

  const paypalStrategy = PaymentFactory.create(PAYMENT_METHOD.PAYPAL);

  const paypalPayment = new PaymentService(paypalStrategy);

  await paypalPayment.processPayment(2500);
}

main().catch(console.error);
