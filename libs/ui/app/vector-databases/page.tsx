import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import VectorDbsClientPage from "./client-page"

export const dynamic = "force-dynamic"

export default async function VectorDatabases() {
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
  const { data: vectorDbsData } = await api.getVectorDbs()

  return (
    <div className="flex min-h-full flex-col space-y-4 px-4 py-6">
      <p className="text-lg">Vector Databases</p>
      <VectorDbsClientPage profile={profile} vectorDbsData={vectorDbsData} />
    </div>
  )
}
