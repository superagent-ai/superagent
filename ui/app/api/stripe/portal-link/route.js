import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/lib/next-auth";
import { stripe } from "@/lib/stripe";

export async function GET(request) {
  const { user } = await getServerSession(options);
  const stripeCustomer = user.user.profile.metadata.stripe_customer_id;

  if (!stripeCustomer) {
    return new Response(
      { succes: false, error: "No stripe customer found." },
      { status: 400 }
    );
  }

  const { url } = await stripe.billingPortal.sessions.create({
    customer: stripeCustomer,
  });

  return NextResponse.json({ succes: true, data: url });
}
