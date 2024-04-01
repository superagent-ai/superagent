import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { stripe } from "@/lib/stripe"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", data?.user.id)
    .single()

  if (profile?.stripe_plan_id !== params.id) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })
  }

  const subscription = await stripe.subscriptions.update(params.id, {
    cancel_at_period_end: true,
  })

  return NextResponse.json(subscription)
}
