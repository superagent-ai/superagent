"use client"

import { siteConfig } from "@/config/site"
import { Toaster } from "@/components/ui/toaster"
import { SettingsSidebar } from "@/components/account-sidebar"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col space-y-4 p-5">
      <p className="text-lg">Settings</p>
      <div className="flex flex-row space-x-20">
        <SettingsSidebar items={siteConfig.settingsNav} />
        <div className="flex flex-1 flex-col space-y-8">{children}</div>
      </div>
      <Toaster />
    </div>
  )
}
