import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Prisma, StripeTransaction, Transaction } from '@prisma/client';
import { StripeTransactionDao } from '../dao/StripeTransactionDao';

dotenv.config();
const stripeKey = process.env.STRIPE_API_KEY;
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-08-16',
});

export class StripeTransactionService {
  constructor(
    private stripeTransactionDao: StripeTransactionDao = new StripeTransactionDao(),
  ) {}

  public async createStripeTransaction(
    creditTransaction: Transaction,
  ): Promise<StripeTransaction | null> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: creditTransaction.amount,
        currency: 'sgd',
        payment_method: 'pm_card_visa',
        confirm: true,
        automatic_payment_methods: {
          allow_redirects: 'never',
          enabled: true,
        },
        metadata: {
          creditTransactionId: creditTransaction.id,
        },
      });

      return this.stripeTransactionDao.createStripeTransaction({
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: 'sgd',
        status:
          paymentIntent.status === 'succeeded' ? 'SUCCEEDED' : 'PROCESSING',
      });
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError) {
        const stripeError = err as Stripe.errors.StripeError;
        console.log(stripeError.message);
        return this.stripeTransactionDao.createStripeTransaction({
          paymentIntentId: stripeError.payment_intent.id,
          amount: stripeError.payment_intent.amount,
          currency: 'sgd',
          status: 'FAILED',
          chargeId: stripeError.charge,
        });
      }
    }
  }

  public async refundStripeTransaction(
    paymentIntentId: string,
    amount: number,
  ): Promise<StripeTransaction> {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
    });

    const stripeTransaction =
      await this.stripeTransactionDao.getStripeTransactionByPaymentIntentId(
        refund.payment_intent as string,
      );

    return stripeTransaction;
  }

  public async getStripeTransactionById(
    transactionId: string,
  ): Promise<StripeTransaction> {
    return this.stripeTransactionDao.getStripeTransactionById(transactionId);
  }

  public async getStripeTransactionByPaymentIntentId(
    paymentIntentId: string,
  ): Promise<StripeTransaction> {
    return this.stripeTransactionDao.getStripeTransactionByPaymentIntentId(
      paymentIntentId,
    );
  }

  public async updateStripeTransaction(
    id: string,
    stripeTransactionData: Prisma.StripeTransactionUncheckedUpdateInput,
  ): Promise<StripeTransaction> {
    return this.stripeTransactionDao.updateStripeTransaction(
      id,
      stripeTransactionData,
    );
  }
}
