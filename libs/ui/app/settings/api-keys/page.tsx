import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import ApiKeysTable from "./api-keys"
import { CreateSecretKey } from "./create-api-key"

export default async function Settings() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  const api = new Api(profile?.api_key)

  let {
    data = [],
  }: {
    data: any[]
  } = await api.getApiKeys()

  return (
    <div className="max-w-3xl">
      <ApiKeysTable profile={profile} data={data} />
      <div className="mt-12">
        <CreateSecretKey profile={profile} />
      </div>
    </div>
  )
}
