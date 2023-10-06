/* eslint-disable no-case-declarations */
import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const stripeKey = process.env.STRIPE_API_KEY;
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-08-16',
});
const endpointSecret = process.env.STRIPE_ENDPOINT_SIGNING_SECRET;

const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payload = req['body'];
  console.log('received payload', payload);

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

  console.log(payload.type);
  switch (payload.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = payload.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
  }
});

export default stripeWebhookRouter;
