import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import Chat from "./chat"

export const dynamic = "force-dynamic"
export default async function AgentPage({ params }: { params: any }) {
  const { workflowId } = params
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
  const { data: workflowData } = await api.getWorkflowById(workflowId)

  const { data: workflowStepsData }: { data: any[] } =
    await api.getWorkflowSteps(workflowId)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* <div className="flex space-x-4">
        <p className="text-lg">{workflow?.name}</p>
      </div> */}
      <div className="flex grow overflow-auto">
        <div className="flex flex-1 flex-col items-center justify-center">
          Workflow UI
        </div>
        <Chat
          profile={profile}
          workflowData={workflowData}
          workflowStepsData={workflowStepsData}
        />
      </div>
    </div>
  )
}
