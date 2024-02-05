import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const { data, type } = await request.json()
  switch (type) {
    case "customer.subscription.trial_will_end":
      const customer = data.object.customer
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
    default:
      return NextResponse.json({ success: false })
  }
}
