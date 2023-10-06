import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripeKey = process.env.STRIPE_API_KEY;
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-08-16',
});

export class StripeTransactionService {
  constructor() {}

  public async createTransaction(): Promise<void> {
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: 500,
    //   currency: 'sgd',
    //   payment_method: 'pm_card_pendingRefund',
    //   confirm: true,
    //   automatic_payment_methods: {
    //     allow_redirects: 'never',
    //     enabled: true,
    //   },
    //   metadata: {
    //     transactionId: '123',
    //   },
    // });

    // const paymentIntent = await stripe.refunds.create({
    //   payment_intent: 'pi_3Ny3DsFslg0wD1QJ0bL6osy2',
    //   amount: 500,
    // });

    // const paymentIntent = await stripe.paymentIntents.retrieve(
    //   'pi_3Ny3DsFslg0wD1QJ0bL6osy2',
    // );

    const transaction = await stripe.balanceTransactions.retrieve(
      'txn_3Ny3DsFslg0wD1QJ0aQLkSa8',
    );

    console.log(transaction);
  }
}
