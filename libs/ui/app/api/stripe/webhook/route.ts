import { cookies, headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import Stripe from "stripe"

import { stripe } from "@/lib/stripe"

interface EventData {
  email?: string
  eventName: string
  company?: string
  first_name?: string
  last_name?: string
}

const sendEvent = async (data: EventData): Promise<void> => {
  await fetch("https://app.loops.so/api/v1/events/send", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
    },
    body: JSON.stringify(data),
  })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = createRouteHandlerClient(
    { cookies },
    {
      // using service role key because of stripe webhook does not have any user session
      supabaseKey: process.env.SUPABASE_SERVICEROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    }
  )
  const sig = headers().get("stripe-signature")

  if (!sig) return NextResponse.json({ success: false })

  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (error) {
    console.error("Stripe webhook error: ", error)

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Webhook error",
        },
      },
      {
        status: 400,
      }
    )
  }
  const subscription = event.data.object as Stripe.Subscription

  if (!subscription.customer) return NextResponse.json({ success: false })

  const customer = subscription.customer.toString()

  const customerData = await stripe.customers.retrieve(customer)

  if ("deleted" in customerData && customerData.deleted === true) {
    return NextResponse.json({ success: false })
  }

  const { email, name } = customerData

  if (!email)
    return NextResponse.json(
      {
        success: false,
        message: "No email is provided",
      },
      { status: 400 }
    )

  const eventData: EventData = {
    eventName: "",
    first_name: customerData.metadata?.first_name,
    last_name: customerData.metadata?.last_name,
  }

  eventData.email = email

  if (name) {
    eventData.company = name
  }

  switch (event.type) {
    case "customer.subscription.trial_will_end":
      eventData.eventName = "trial_ends"
      await sendEvent(eventData)
      return NextResponse.json({ success: true })

    case "customer.subscription.deleted":
      const { data } = await supabase
        .from("profiles")
        .select("stripe_plan_id")
        .eq("stripe_customer_id", customer)
        .single()

      // if deleted subscription is not the current subscription, return
      if (subscription.id !== data?.stripe_plan_id) {
        return NextResponse.json({ success: true })
      }

      eventData.eventName = "subscription_deleted"
      await supabase
        .from("profiles")
        .update({ stripe_plan_id: null })
        .eq("stripe_customer_id", customer)
      await sendEvent(eventData)
      return NextResponse.json({ success: true })

    case "customer.subscription.created":
      eventData.eventName = "subscription_created"

      // cancel other subscription(s)
      const subscriptions = await stripe.subscriptions.list({
        customer: customer,
        status: "active",
      })
      subscriptions.data
        .filter((s) => s.id !== subscription.id)
        .forEach(async (sub) => {
          await stripe.subscriptions.update(sub.id, {
            cancel_at_period_end: true,
          })
        })

      await supabase
        .from("profiles")
        .update({ stripe_plan_id: subscription.id })
        .eq("stripe_customer_id", customer)
      await sendEvent(eventData)
      return NextResponse.json({ success: true })

    case "customer.subscription.updated":
      eventData.eventName = "subscription_updated"
      await supabase
        .from("profiles")
        .update({ stripe_plan_id: subscription.id })
        .eq("stripe_customer_id", customer)
      await sendEvent(eventData)
      return NextResponse.json({ success: true })

    default:
      return NextResponse.json({ success: false })
  }
}
