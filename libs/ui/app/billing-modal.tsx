"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { set } from "react-hook-form"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import PricingTable from "@/app/settings/billing/pricing-table"

interface BillingModalProps {
  profile: any
}

export default function BillingModal({ profile }: BillingModalProps) {
  const pathname = usePathname()
  const [isClient, setClient] = useState(false)

  // a workaround for react hydration error (https://github.com/radix-ui/primitives/issues/1386)
  useEffect(() => setClient(true), [])

  if (!isClient) return null

  return (
    <AlertDialog
      open={
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
          <PricingTable
            stripeCustomerId={profile?.stripe_customer_id}
            currentSubscriptionId={profile?.stripe_plan_id}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
