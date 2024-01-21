import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import { columns } from "./columns"
import { DataTable } from "./data-table"

interface AssistantsLayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

export default async function AssistantsLayout({
  params,
  children,
}: AssistantsLayoutProps) {
  let agent = ""
  const supabase = createRouteHandlerClient({ cookies })
  const { slug } = params
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

  if (slug) {
    const { data } = await api.getAgentById(slug)
    agent = data
  }

  return (
    <div className="flex h-screen flex-col justify-between space-y-0 overflow-hidden">
      <p className="border-b px-6 py-5 font-medium">Assistants</p>
      <div className="flex grow overflow-auto">
        <DataTable columns={columns} data={agents} />
        {children}
      </div>
    </div>
  )
}
