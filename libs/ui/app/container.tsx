"use client";
import Sidebar from "@/components/sidebar";

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <section className="flex h-screen gap-6">
      <Sidebar />
      <div className="flex-1 py-6">
        {children}
      </div>
    </section>
  )
}
