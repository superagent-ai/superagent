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
  const { id } = searchParams
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()
  const api = new Api(profile.api_key)

  const { data: agents } = await api.getAgents({
    skip: 0,
    take: 300,
  })

  if (id) {
    const { data } = await api.getAgentById(id)
    agent = data
  }

  return (
    <div className="flex h-screen flex-col justify-between space-y-0 overflow-hidden">
      <p className="border-b px-6 py-5 font-medium">Logs</p>
      <div className="flex grow overflow-auto">
        <LogList agent={agent} />
      </div>
    </div>
  )
}
