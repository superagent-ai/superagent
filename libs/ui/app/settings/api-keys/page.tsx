import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import ApiKeysClientPage from "./client-page"

export const dynamic = "force-dynamic"

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profile.api_key)
  }

  return <ApiKeysClientPage profile={profile} />
}
