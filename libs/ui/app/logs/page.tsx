import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"
import LogList from "@/components/log-list"

export const dynamic = "force-dynamic"

export default async function Agents({
  searchParams,
}: {
  searchParams: {
    id: string
  }
}) {
  let agent = ""
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()
  const api = new Api(profile.api_key)

  const { data: logs } = await api.getRuns({ limit: 50 })

  return (
    <div className="flex h-screen flex-col justify-between space-y-0 overflow-hidden">
      <p className="border-b px-6 py-4 font-medium">Logs</p>
      <div className="flex grow overflow-auto">
        <LogList data={logs} profile={profile} />
      </div>
    </div>
  )
}
