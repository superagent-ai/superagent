import { cookies } from "next/headers"
import Link from "next/link"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
      {agent.type === "SUPERAGENT" ? (
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
      ) : (
        <div className="mx-auto mt-20">
          <Alert className="" variant="destructive">
            <AlertTitle>Deprecated</AlertTitle>
            <AlertDescription>
              This page is deprecated and will be removed in a future release.
              <br />
              For creating new agents, please use the workflows page.{" "}
              <Link href="/workflows" className="font-bold underline">
                Click here to create a new workflows page.
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
