"use client"

import { useAsync } from "react-use"
import Stripe from "stripe"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import UpgradeButton from "./upgrade-plan-button"

interface PricingTableProps {
  stripeCustomerId: string
  currentSubscriptionId?: string
}

interface Plan {
  details: Stripe.Plan
  description: string
  name: string
  order: number
}

const getPlansDetails = async (): Promise<
  Record<keyof typeof siteConfig.paymentPlans, Stripe.Plan>
> => {
  const res = await fetch(`/api/stripe/plans`)
  return await res.json()
}

const getSubscription = async (
  subscriptionId?: string
): Promise<Stripe.Subscription | undefined> => {
  if (!subscriptionId) return

  const res = await fetch(`/api/stripe/subscriptions/${subscriptionId}`)
  return await res.json()
}

function LoadingSkeleton() {
  return (
    <div className="flex space-x-8">
      {new Array(Object.keys(siteConfig.paymentPlans).length)
        .fill(0)
        .map((_, idx) => (
          <div key={idx} className="flex-1">
            <Skeleton className="h-24 w-full bg-gray-300 dark:bg-gray-600" />
            <Skeleton className="mt-4 h-8 w-full bg-gray-300 dark:bg-gray-600" />
          </div>
        ))}
    </div>
  )
}

const PricingTable = ({
  stripeCustomerId,
  currentSubscriptionId,
}: PricingTableProps) => {
  const { value, loading } = useAsync(async () => {
    const { hobby, pro } = await getPlansDetails()
    const currentSubscription = await getSubscription(currentSubscriptionId!)

    return { hobbyPlanDetails: hobby, proPlanDetails: pro, currentSubscription }
  })

  if (loading || !value) {
    return <LoadingSkeleton />
  }

  const { hobbyPlanDetails, proPlanDetails, currentSubscription } = value

  const plans: Record<string, Plan> = {
    [siteConfig.paymentPlans["hobby"]]: {
      details: hobbyPlanDetails,
      description: "Perfect for experimenting with a new idea.",
      name: "Hobby",
      order: 0,
    },
    [siteConfig.paymentPlans["pro"]]: {
      details: proPlanDetails,
      description:
        "Offers enhanced capabilities for professional developers and businesses.",
      name: "Pro",
      order: 1,
    },
  }

  return (
    <div className="flex  divide-x">
      {Object.entries(plans).map(([planId, plan], idx) => {
        const currentPlan: Stripe.Plan = (currentSubscription as any)?.plan
        const isCurrentPlan = currentPlan?.id === planId

        return (
          <div
            key={planId}
            className={cn(
              "flex flex-1 flex-col justify-between",
              idx > 0 && "pl-8"
            )}
          >
            <div>
              {currentSubscription?.trial_end &&
                currentSubscription?.status === "trialing" &&
                isCurrentPlan && (
                  <Badge className="mb-2" variant="default">
                    Ends on{" "}
                    {new Date(
                      currentSubscription.trial_end * 1000
                    ).toLocaleDateString()}
                  </Badge>
                )}
              <h2 className="font-semibold">{plan.name}</h2>
              <div className="mb-4 mt-2">
                <p className="mb-[2px] text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
                <span className="font-semibold">
                  ${plan.details.amount! / 100}/mo
                </span>
              </div>
            </div>
            <div>
              <UpgradeButton
                planId={planId}
                stripeCustomerId={stripeCustomerId}
                isAlreadySubscribedToPlan={currentPlan?.id === planId}
                isLowerPlan={
                  plans[currentPlan?.id as string]?.order > plan.order
                }
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PricingTable
