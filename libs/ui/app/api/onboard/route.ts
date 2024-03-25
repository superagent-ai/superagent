import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import Stripe from "stripe"
import { z } from "zod"

import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { stripe } from "@/lib/stripe"

import { onboardFormSchema } from "./form-schema"

const api = new Api()

export const POST = async (req: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await req.json()
  let parsedBody
  try {
    parsedBody = onboardFormSchema.parse(body)
  } catch (error) {
    let errorMessage = "Invalid form data"
    if (error instanceof z.ZodError) {
      errorMessage = error.errors[0].message
    }
    return NextResponse.json(
      {
        error: {
          message: errorMessage,
        },
      },
      { status: 400 }
    )
  }

  const { first_name, last_name, company } = parsedBody

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) {
    return NextResponse.json(
      {
        error: {
          message: "User email is missing!",
        },
      },
      { status: 400 }
    )
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  let api_key = profile?.api_key
  if (!api_key) {
    const {
      data: { token: api_key },
    } = await api.createApiUser({
      email: user.email,
      firstName: first_name,
      lastName: last_name,
      company,
    })
    await supabase
      .from("profiles")
      .update({
        api_key,
      })
      .eq("user_id", user?.id)
  }

  const params: Stripe.CustomerCreateParams = {
    name: company,
    email: user.email,
    metadata: {
      first_name,
      last_name,
    },
  }
  let customer: Stripe.Customer | null = null
  let subscription: Stripe.Subscription | null = null
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    customer = await stripe.customers.create(params)
    subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: [
        {
          price: siteConfig.paymentPlans.hobby,
        },
      ],
      // 7 days trial
      trial_end: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      trial_settings: {
        end_behavior: {
          missing_payment_method: "cancel",
        },
      },
    })
  }
  const { error, data } = await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
      company,
      stripe_customer_id: customer?.id,
      stripe_plan_id: subscription?.id,
      is_onboarded: true,
    })
    .eq("user_id", user?.id)
    .select()

  if (error) {
    return NextResponse.json(
      {
        error: {
          message: error?.message,
        },
      },
      { status: 400 }
    )
  }

  return NextResponse.json(data[0])
}
