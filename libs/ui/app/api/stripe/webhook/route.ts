import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICEROLE_KEY!
  )
  const { data, type } = await request.json()
  const customer = data.object.customer
  switch (type) {
    case "customer.subscription.trial_will_end":
      const c_data: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer> =
        await stripe.customers.retrieve(customer)

      if ("deleted" in c_data && c_data.deleted === true) {
        return NextResponse.json({ success: false })
      }

      const { email, name } = c_data

      await fetch("https://app.loops.so/api/v1/events/send", {
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          eventName: "trial_ends",
          company: name,
          first_name: c_data.metadata?.first_name,
          last_name: c_data.metadata?.last_name,
        }),
      })

      return NextResponse.json({ success: true })
    case "customer.subscription.deleted":
      await supabase
        .from("profiles")
        .update({ stripe_plan_id: null })
        .eq("stripe_customer_id", customer)
        .select()
      return NextResponse.json({ success: true })
    case "customer.subscription.created":
      await supabase
        .from("profiles")
        .update({ stripe_plan_id: data.object.id })
        .eq("stripe_customer_id", customer)
      return NextResponse.json({ success: true })
    case "customer.subscription.updated":
      await supabase
        .from("profiles")
        .update({ stripe_plan_id: data.object.id })
        .eq("stripe_customer_id", customer)
    default:
      return NextResponse.json({ success: false })
  }
}
