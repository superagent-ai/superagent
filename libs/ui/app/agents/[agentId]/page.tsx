import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import Chat from "./chat"
import Header from "./header"
import Settings from "./settings"

export const dynamic = "force-dynamic"
export default async function AgentPage({ params }: { params: any }) {
  const { agentId } = params
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
  const { data: agent } = await api.getAgentById(agentId)

  return (
    <div className="flex min-h-screen flex-col">
      <Header agent={agent} profile={profile} />
      <div className="flex flex-1">
        <Chat agent={agent} />
        <Settings />
      </div>
    </div>
  )
}
