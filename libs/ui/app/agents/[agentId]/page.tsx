import { cookies } from "next/headers"
import Link from "next/link"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { TbBrandOpenai } from "react-icons/tb"

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
        <div className="container mt-20 flex max-w-lg flex-col space-y-4 rounded-lg border py-6 text-sm">
          <TbBrandOpenai fontSize="30px" />
          <div className="flex flex-col space-y-2">
            <p className="font-semibold">OpenAI Assistants</p>
            <p className="text-muted-foreground">
              We currently don&apos;t support running OpenAI Assistants outside
              of workflows. Please visit the{" "}
              <Link className="underline" href="/workflows">
                workflows page
              </Link>{" "}
              to run this assistant.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
