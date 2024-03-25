import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

import { siteConfig } from "@/config/site"
import { stripe } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const planNames = Object.keys(siteConfig.paymentPlans)
  const planPromises = planNames.map((planName) =>
    stripe.plans.retrieve(
      siteConfig.paymentPlans?.[
        planName as keyof typeof siteConfig.paymentPlans
      ]
    )
  )

  try {
    const plans = await Promise.all(planPromises)

    const plansObject: Record<string, Stripe.Plan> = {}
    planNames.forEach((planName, index) => {
      plansObject[planName] = plans[index]
    })

    return NextResponse.json(plansObject, { status: 200 })
  } catch (error) {
    console.error("Error fetching payment plans:", error)
    return NextResponse.json(
      {
        error: {
          message: "Error fetching payment plans",
        },
      },
      {
        status: 500,
      }
    )
  }
}
