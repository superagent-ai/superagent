import { cookies } from "next/headers"
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { DataTable } from "./data-table";

export default async function Integration() {



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
    <div className="flex flex-col space-y-4 p-6">
      <h2 className="mb-5 text-lg">Integraciones con Plataformas 🤖🤟</h2>
      <DataTable
        profile={profile}
      />
    </div>
  )
}
