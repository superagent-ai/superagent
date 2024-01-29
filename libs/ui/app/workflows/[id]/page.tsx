import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import WorkflowDetail from "./workflow"

export default async function Assistant({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = params
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()
  const api = new Api(profile.api_key)
  const { data: workflow } = await api.getWorkflowById(id)
  const { data: llms } = await api.getLLMs()

  return workflow ? (
    <WorkflowDetail workflow={workflow} profile={profile} llms={llms} />
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center">
      <p className="text-sm font-medium">No assistant selected</p>
      <p className="text-sm">
        View details about an assistant by navigating the list to the left
      </p>
    </div>
  )
}
