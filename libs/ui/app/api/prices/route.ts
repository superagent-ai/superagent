import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET() {
  const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('Stripe secret key is undefined.');
  }
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-08-16'
  });
  const prices = await stripe.prices.list();
  return NextResponse.json(prices.data);
}

