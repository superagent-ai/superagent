"use client"

import { useEffect } from "react"
import Stripe from "stripe"

import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

interface CheckoutSessionStatusProps {
  session: Stripe.Checkout.Session
}

function CheckoutSessionStatus({ session }: CheckoutSessionStatusProps) {
  const { toast } = useToast()

  useEffect(() => {
    if (session.status === "complete") {
      toast({
        title: "Success",
        description: "Your payment was successful",
      })
    } else {
      toast({
        title: "Error",
        description: "Your payment failed",
      })
    }
  }, [session])

  return <Toaster />
}

export default CheckoutSessionStatus
