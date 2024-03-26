import { NextRequest, NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const subscription = await stripe.subscriptions.retrieve(params.id, {
    expand: ["plan"],
  })

  return NextResponse.json(subscription)
}
