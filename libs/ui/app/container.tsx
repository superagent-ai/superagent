import Sidebar from "@/components/sidebar"

import BillingModal from "./billing-modal"

interface RootLayoutProps {
  children: React.ReactNode
  session: any
}

export default async function RootLayout({
  children,
  session,
}: RootLayoutProps) {
  return (
    <section className="flex h-screen">
      <BillingModal session={session} />
      <Sidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </section>
  )
}
