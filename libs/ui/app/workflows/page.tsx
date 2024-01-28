import { cookies } from "next/headers"
import Link from "next/link"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { TbPlus } from "react-icons/tb"

import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"

import WorkflowCards from "./cards"

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
    <div className="flex h-screen w-full flex-col justify-between space-y-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-2 font-medium">
        <span>Workflows</span>
        <Link passHref href="/workflows/new">
          <Button size="sm" className="space-x-2">
            <TbPlus />
            <span>New worflow</span>
          </Button>
        </Link>
      </div>
      <WorkflowCards workflows={workflows} />
    </div>
  )
}
