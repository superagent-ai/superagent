import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import PricingTable from "@/app/settings/billing/pricing-table"

export default async function Billing() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-2">
        <p className="text-lg font-bold">Billing Plans</p>
        <p className="text-sm text-muted-foreground">
          Subscribe to a plan to get started.
        </p>
      </div>
      <hr />
      <div className="flex w-full max-w-5xl flex-col">
        <PricingTable
          stripeCustomerId={profile?.stripe_customer_id}
          currentSubscriptionId={profile?.stripe_plan_id}
        />
      </div>
    </div>
  )
}
