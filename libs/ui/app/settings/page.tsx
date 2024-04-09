import { cookies } from "next/headers"
import {
  createRouteHandlerClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs"

import SettingsClientPage from "./client-page"

export const dynamic = "force-dynamic"

export default async function Settings() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  return user ? <SettingsClientPage profile={profile} user={user} /> : null
}
