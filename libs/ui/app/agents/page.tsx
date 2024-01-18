import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export const dynamic = "force-dynamic"

export default async function Agents() {
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
  const { data: agents } = await api.getAgents({
    skip: 0,
    take: 40,
  })

  return (
    <div className="flex h-screen flex-col justify-between space-y-0 overflow-hidden">
      <p className="border-b px-6 py-5">Assistants</p>
      <div className="flex grow overflow-auto">
        <DataTable columns={columns} data={agents} />
        <div className="px-6">
          <p>test</p>
        </div>
      </div>
    </div>
  )
}
