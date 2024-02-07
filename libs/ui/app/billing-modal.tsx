"use client"

import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useTheme } from "next-themes"
import { useAsync } from "react-use"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BillingModal({ session }: { session: any }) {
  const theme = useTheme()
  const pathname = usePathname()
  const supabase = createClientComponentClient()
  const { loading, value: profile } = useAsync(async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session?.user.id)
      .single()

    return profile
  })

  const pricingTableID =
    theme.resolvedTheme === "dark"
      ? process.env.NEXT_PUBLIC_STRIPE_DARK_PRICING_TABLE_ID
      : process.env.NEXT_PUBLIC_STRIPE_LIGHT_PRICING_TABLE_ID

  return (
    <AlertDialog
      open={
        !loading &&
        !profile?.stripe_plan_id &&
        pathname !== "/onboarding" &&
        pathname !== "/"
      }
    >
      <AlertDialogContent className="max-w-[700px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Your free trial has ended!</AlertDialogTitle>
          <AlertDialogDescription>
            Hey {profile?.first_name}, your free trial has ended and you need to
            subscribe to one of our plans to get access to your agents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4">
          <stripe-pricing-table
            pricing-table-id={pricingTableID}
            publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
