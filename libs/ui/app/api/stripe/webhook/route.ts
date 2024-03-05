import { NextRequest, NextResponse } from "next/server"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import Stripe from "stripe"

import { stripe } from "@/lib/stripe"

interface EventData {
  email?: string
  eventName: string
  company?: string
  first_name?: string
  last_name?: string
}

let supabaseClient: SupabaseClient | null = null;
const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICEROLE_KEY || ""
    );
  }
  return supabaseClient;
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = getSupabase();
  const { data, type } = await request.json()
  const customer = data.object.customer

  const c_data: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer> =
    await stripe.customers.retrieve(customer)

  if ("deleted" in c_data && c_data.deleted === true) {
    return NextResponse.json({ success: false })
  }

  const { email, name } = c_data

  const eventData: EventData = {
    eventName: "",
    first_name: c_data.metadata?.first_name,
    last_name: c_data.metadata?.last_name,
  }

  if (email) {
    eventData.email = email
  }

  if (name) {
    eventData.company = name
  }

  switch (type) {
    case "customer.subscription.trial_will_end":
      eventData.eventName = "trial_ends"
      await sendEvent(eventData)
      return NextResponse.json({ success: true })

    case "customer.subscription.deleted":
      eventData.eventName = "subscription_deleted"
      await supabase
        .from("profiles")
        .update({ stripe_plan_id: null })
        .eq("stripe_customer_id", customer)
      await sendEvent(eventData)
      return NextResponse.json({ success: true })

    case "customer.subscription.created":
      eventData.eventName = "subscription_created"
      await supabase
        .from("profiles")
        .update({ stripe_plan_id: data.object.id })
        .eq("stripe_customer_id", customer)
      await sendEvent(eventData)
      return NextResponse.json({ success: true })

    case "customer.subscription.updated":
      eventData.eventName = "subscription_updated"
      await supabase
        .from("profiles")
        .update({ stripe_plan_id: data.object.id })
        .eq("stripe_customer_id", customer)
      await sendEvent(eventData)
      return NextResponse.json({ success: true })

    default:
      return NextResponse.json({ success: false })
  }
}
