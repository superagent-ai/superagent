import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { promise } from "zod"

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
  const [
    { data: agent },
    { data: tools },
    { data: datasources },
    { data: llms },
  ] = await Promise.all([
    api.getAgentById(agentId),
    api.getTools(),
    api.getDatasources(),
    api.getLLMs(),
  ])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header agent={agent} profile={profile} />
      <div className="flex grow overflow-auto">
        <Chat agent={agent} profile={profile} />
        <Settings
          agent={agent}
          configuredLLMs={llms}
          tools={tools}
          profile={profile}
          datasources={datasources}
        />
      </div>
    </div>
  )
}
