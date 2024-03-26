import { NextRequest, NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await stripe.checkout.sessions.retrieve(params.id)
  return NextResponse.json(session)
}
