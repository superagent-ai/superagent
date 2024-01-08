"use client"
import Sidebar from "@/components/sidebar"
import { ChatwootProvider } from "./context/ChatwootContext"

interface RootLayoutProps {
  children: React.ReactNode
  session: any
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <ChatwootProvider>
      <section className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </section>
    </ChatwootProvider>
  )
}
