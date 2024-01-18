import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import Agent from "./agent"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export const dynamic = "force-dynamic"

interface SearchParams {
  searchParams: string
}

export default async function Agents({
  searchParams,
}: {
  searchParams: {
    agentId: string
  }
}) {
  let agent = ""
  const supabase = createRouteHandlerClient({ cookies })
  const { agentId } = searchParams
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

  if (agentId) {
    const { data } = await api.getAgentById(agentId)
    agent = data
  }

  return (
    <div className="flex h-screen flex-col justify-between space-y-0 overflow-hidden">
      <p className="border-b px-6 py-5">Assistants</p>
      <div className="flex grow overflow-auto">
        <DataTable columns={columns} data={agents} />
        <Agent agent={agent} profile={profile} />
      </div>
    </div>
  )
}
