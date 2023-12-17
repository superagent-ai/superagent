import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import WorkflowEditor from "./WorkflowEditor"
import Chat from "./chat"

export const dynamic = "force-dynamic"
export default async function Workflow({ params }: { params: any }) {
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

  const [
    { data: workflowData },
    { data: workflowStepsData },
    { data: agentsData },
  ] = await Promise.all([
    api.getWorkflowById(workflowId),
    api.getWorkflowSteps(workflowId),
    api.getAgents(),
  ])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex grow overflow-auto">
        <div className="flex flex-1 flex-col items-center p-2">
          <WorkflowEditor
            api_key={profile?.api_key}
            agentsData={agentsData}
            workflowData={workflowData}
            workflowStepsData={workflowStepsData}
          />
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
