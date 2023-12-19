import { cookies } from "next/headers"
import { Workflow } from "@/models/models"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import DangerZone from "./danger-zone"
import Update from "./update"

export default async function EditWorkflow({
  params,
}: {
  params: { workflowId: string }
}) {
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

  return (
    <div className="mx-auto flex max-w-2xl flex-col space-y-20 py-20">
      <Update api_key={profile?.api_key} workflowData={workflowData} />
      <DangerZone api_key={profile?.api_key} workflowData={workflowData} />
    </div>
  )
}
