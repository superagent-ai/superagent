"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function AppearanceClientPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-bold">Appearance</p>
        <p className="text-sm text-muted-foreground">
          Update the appearance of the Superagent dashboard
        </p>
      </div>
      <ThemeToggle />
    </div>
  )
}
