import {NextResponse} from 'next/server'
import Stripe from 'stripe';

export async function POST(request: Request) {
    const res = await request.json()

    const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('The Stripe secret key is not defined in the environment variables.');
    }
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-08-16',
    });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: res.priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_WEB_HOST}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_WEB_HOST}/pricing`,
  });
  return NextResponse.json({
    url: session.url,
  });
}
