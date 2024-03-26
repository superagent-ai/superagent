"use client"

import getStripe from "@/utils/get-stripejs"

import { Button, ButtonProps } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

type UpgradeButtonProps = {
  stripeCustomerId: string
  planId: string
  isAlreadySubscribedToPlan: boolean
  isLowerPlan: boolean
} & ButtonProps

function UpgradeButton({
  stripeCustomerId,
  planId,
  isAlreadySubscribedToPlan,
  isLowerPlan,
  ...buttonProps
}: UpgradeButtonProps) {
  const { toast } = useToast()

  const redirectToStripeCheckout = async () => {
    const res = await fetch("/api/stripe/sessions", {
      method: "POST",
      body: JSON.stringify({
        planId,
        customerId: stripeCustomerId,
      }),
    })
    const session = await res.json()

    if (!res.ok) {
      return toast({
        title: "Error",
        description: "Something went wrong",
      })
    }

    const stripe = await getStripe()

    await stripe?.redirectToCheckout({
      sessionId: session.id,
    })
  }

  const isDisabled = isAlreadySubscribedToPlan

  return (
    <>
      <Button
        onClick={redirectToStripeCheckout}
        disabled={isDisabled}
        {...buttonProps}
      >
        {isAlreadySubscribedToPlan
          ? "Your Current Plan"
          : isLowerPlan
            ? "Downgrade"
            : "Upgrade"}
      </Button>
      <Toaster />
    </>
  )
}

export default UpgradeButton
