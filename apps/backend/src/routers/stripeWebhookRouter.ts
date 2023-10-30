/* eslint-disable no-case-declarations */
import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { StripeTransactionService } from '../services/StripeTransactionService';

dotenv.config();
const stripeKey = process.env.STRIPE_API_KEY;
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-08-16',
});
const endpointSecret = process.env.STRIPE_ENDPOINT_SIGNING_SECRET;

const stripeWebhookRouter = express.Router();
const stripeTransactionService = new StripeTransactionService();

stripeWebhookRouter.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payload = req['body'];

  try {
    // event = stripe.webhooks.constructEvent(
    //   JSON.stringify(payload),
    //   sig,
    //   endpointSecret,
    // );
    res.sendStatus(200).end();
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (payload.type) {
    case 'charge.succeeded':
      const chargeSucceeded = payload.data.object;

      const succeededTransaction =
        await stripeTransactionService.getStripeTransactionByPaymentIntentId(
          chargeSucceeded.payment_intent as string,
        );
      if (succeededTransaction) {
        await stripeTransactionService.updateStripeTransaction(
          succeededTransaction.id,
          {
            receiptUrl: chargeSucceeded.receipt_url as string,
            status: 'SUCCEEDED',
            chargeId: chargeSucceeded.id as string,
          },
        );
      }
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case 'charge.refunded':
      const chargeRefunded = payload.data.object;

      const refundedTransaction =
        await stripeTransactionService.getStripeTransactionByPaymentIntentId(
          chargeRefunded.payment_intent as string,
        );
      if (refundedTransaction) {
        await stripeTransactionService.updateStripeTransaction(
          refundedTransaction.id,
          {
            receiptUrl: chargeRefunded.receipt_url as string,
            status: 'REFUNDED',
            chargeId: chargeRefunded.id as string,
          },
        );
      }

      break;
  }
});

export default stripeWebhookRouter;
