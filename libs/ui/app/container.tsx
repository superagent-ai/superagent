"use client"

import Sidebar from "@/components/sidebar"

interface RootLayoutProps {
  children: React.ReactNode
  session: any
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  console.log(session)
  return (
    <section className="flex h-screen">
      {session && <Sidebar />}
      <div className="flex-1 overflow-hidden">{children}</div>
    </section>
  )
}
