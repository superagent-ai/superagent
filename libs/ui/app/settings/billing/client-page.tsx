"use client"

import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { stripe } from "@/lib/stripe"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ApiKeysPageProps {
  profile: any
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

const BillingClientPage: React.FC<ApiKeysPageProps> = ({ profile }) => {
  const onSubscribe = async (plan: string) => {
    await stripe.subscriptions.create({
      customer: profile?.stripe_customer_id,
      items: [
        {
          price:
            siteConfig.paymentPlans[
              plan as keyof typeof siteConfig.paymentPlans
            ],
        },
      ],
      trial_period_days: 0,
      payment_settings: {
        save_default_payment_method: "off",
      },
    })
    const { url } = await stripe.billingPortal.sessions.create({
      customer: profile?.stripe_customer_id,
    })
    window.location.href = url
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-bold">Billing</p>
        <p className="text-sm text-muted-foreground">
          Subscribe to a plan to get started.
        </p>
      </div>
      <div className="flex w-full max-w-2xl flex-col">
        <stripe-pricing-table
          className="font-mono"
          pricing-table-id="prctbl_1OgUJ3EcXicRkqG4L4Iu2H2N"
          publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        />
      </div>
    </div>
  )
}

export default BillingClientPage
