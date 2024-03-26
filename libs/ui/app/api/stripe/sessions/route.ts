import { NextRequest, NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const customerId = body.customerId
  const planId = body.planId

  const protocol = req.headers.get("x-forwarded-proto") || "http"
  const host = req.headers.get("host")
  const baseUrl = `${protocol}://${host}`

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: planId,
        quantity: 1,
      },
    ],
    customer: customerId,

    success_url: `${baseUrl}/workflows?checkout_session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/workflows`,
  })

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Failed to create session",
        },
      },
      { status: 500 }
    )
  }

  return NextResponse.json(session)
}
