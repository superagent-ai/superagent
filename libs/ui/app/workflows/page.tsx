import { cookies } from "next/headers"
import Link from "next/link"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { TbAlertTriangle } from "react-icons/tb"

import { Api } from "@/lib/api"

import WorkflowCards from "./cards"
import Header from "./header"

export const dynamic = "force-dynamic"

export default async function Agents() {
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

  const { data: workflows } = await api.getWorkflows()

  return (
    <div className="flex h-screen w-full flex-col justify-between space-y-4 overflow-hidden">
      <Header profile={profile} />
      <WorkflowCards workflows={workflows} />
    </div>
  )
}
