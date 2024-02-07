import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { siteConfig } from "@/config/site"
import { Toaster } from "@/components/ui/toaster"
import { SettingsSidebar } from "@/components/account-sidebar"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  return (
    <div className="flex flex-col space-y-4 ">
      <p className="border-b px-6 py-5 font-medium">Settings</p>
      <div className="flex flex-row space-x-20 p-5">
        <SettingsSidebar items={siteConfig.settingsNav} profile={profile} />
        <div className="flex flex-1 flex-col space-y-8">{children}</div>
      </div>
    </div>
  )
}
