import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import Sidebar from "@/components/sidebar"

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <section className="flex h-screen">
      {session && <Sidebar />}
      <div className="flex-1 overflow-hidden">{children}</div>
    </section>
  )
}
