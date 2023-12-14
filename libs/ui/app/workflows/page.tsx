import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import WorkflowEditor from "./WorkflowEditor"

export default async function Workflows() {
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
  const { data } = await api.getAgents()

  return (
    <div className="flex min-h-full flex-col space-y-4 px-4 py-6">
      <div className="flex space-x-4">
        <p className="text-lg">Workflows</p>
      </div>
      <div className="flex flex-1 flex-row">
        <div className="flex flex-1 flex-col items-center justify-center">
          <WorkflowEditor data={data} />
        </div>
        <div className="flex-1">Chat UI</div>
      </div>
    </div>
  )
}
