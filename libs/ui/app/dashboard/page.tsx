import { cookies } from "next/headers"
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { CardTable } from "./components/card";

export default async function Dashboard() {



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
    <div className="flex flex-col space-y-4 px-4 py-6">
      <h2 className="text-lg">Dashboard</h2>
      <CardTable profile={profile}/>
    </div>
  )
}
