"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAsync } from "react-use"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BillingModal({ session }: { session: any }) {
  const supabase = createClientComponentClient()
  const { loading, value: profile } = useAsync(async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session?.user.id)
      .single()

    return profile
  })

  return (
    <AlertDialog open={!loading && !profile?.stripe_plan_id}>
      <AlertDialogContent className="max-w-[800px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Your free trial has ended!</AlertDialogTitle>
          <AlertDialogDescription>
            Hey {profile?.first_name}, your free trial has ended and you need to
            subscribe to one of our plans to get access to your agents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="">
          <stripe-pricing-table
            pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
            publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
