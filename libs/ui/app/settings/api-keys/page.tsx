import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import ApiKeysTable from "./api-keys"
import { CreateSecretKey } from "./create-secret-key"

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

  return (
    <div className="max-w-3xl">
      <ApiKeysTable profile={profile} />
      <div className="mt-12 flex justify-end">
        <CreateSecretKey profile={profile} />
      </div>
    </div>
  )
}
