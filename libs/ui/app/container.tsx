"use client";
import Sidebar from "@/components/sidebar";

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <section className="flex h-screen items-center gap-6">
      <Sidebar />
      {children}
    </section>
  )
}
