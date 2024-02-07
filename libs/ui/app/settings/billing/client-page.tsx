"use client"

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

const BillingClientPage = () => {
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
