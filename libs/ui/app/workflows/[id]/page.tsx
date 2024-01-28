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

  return <WorkflowDetail workflow={workflow} profile={profile} />
}
