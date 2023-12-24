import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function Workflows({
  searchParams,
}: {
  searchParams: {
    page: string
    take: string
  }
}) {
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
  const { take: takeStr, page: pageStr } = searchParams
  const take = Number(takeStr) || 10,
    page = Number(pageStr) || 1

  const { data: workflows, total_pages } = await api.getWorkflows({
    skip: (page - 1) * take,
    take,
  })

  return (
    <div className="flex flex-col space-y-4 px-4 py-6">
      <p className="text-lg">Workflows</p>
      <DataTable
        columns={columns}
        data={workflows}
        profile={profile}
        pagination={{
          currentPageNumber: page,
          take,
          totalPages: total_pages,
        }}
      />
    </div>
  )
}
