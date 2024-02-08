import { cookies } from "next/headers"
import Link from "next/link"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { TbAlertTriangle } from "react-icons/tb"

import { Api } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

  const showAlert = new Date(profile.created_at) >= new Date("2024-02-06")

  return (
    <div className="flex h-screen w-full flex-col justify-between space-y-4 overflow-hidden">
      <Header profile={profile} />
      {showAlert && (
        <div className="px-6">
          <Alert>
            <AlertDescription className=" flex items-center space-x-4 font-semibold ">
              <TbAlertTriangle fontSize="20px" className="text-orange-400" />
              <p>
                Heads up! We are replacing the legacy agents view with
                workflows. The legacy view can still be{" "}
                <Link href="/agents" className="underline">
                  accessed here
                </Link>{" "}
                for a limited time while we migrate your agents.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <WorkflowCards workflows={workflows} />
    </div>
  )
}
