"use client"

import { Toaster } from "@/components/ui/sonner"
import Sidebar from "@/components/sidebar"

import BillingModal from "./billing-modal"

interface RootLayoutProps {
  children: React.ReactNode
  session: any
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <section className="flex h-screen">
      {process.env.NEXT_PUBLIC_STRIPE_DARK_PRICING_TABLE_ID && (
        <BillingModal session={session} />
      )}
      <Sidebar />
      <div className="flex-1 overflow-auto">{children}</div>
      <Toaster />
    </section>
  )
}
