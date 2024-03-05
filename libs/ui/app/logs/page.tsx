import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { TbTerminal2 } from "react-icons/tb"

import { Api } from "@/lib/api"
import LogList from "@/components/log-list"

export const dynamic = "force-dynamic"

export default async function Agents({
  searchParams,
}: {
  searchParams: {
    id: string
  }
}) {
  let agent = ""
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

  return (
    <div className="flex h-screen flex-col justify-between space-y-0 overflow-hidden">
      <p className="border-b px-6 py-4 font-medium">Logs</p>
      <div className="flex grow overflow-auto">
        {/*<LogList data={logs} profile={profile} /> */}
        <div className="flex h-full w-full items-center justify-center ">
          <div className="container flex max-w-lg flex-col space-y-6 rounded-lg border p-6">
            <TbTerminal2 fontSize="30px" />
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-semibold">Coming soon</p>
              <p className="text-sm text-muted-foreground">
                We will be rolling out detailed logs for your workflows soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
