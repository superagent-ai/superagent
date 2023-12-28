import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export const dynamic = "force-dynamic"

export default async function Datasources({
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

  const { data: datasources, total_pages } = await api.getDatasources({
    skip: (page - 1) * take,
    take,
  })

  return (
    <div className="flex min-h-full flex-col space-y-4 px-4 py-6">
      <p className="text-lg">Datasources</p>
      <DataTable
        columns={columns}
        data={datasources}
        profile={profile}
        pagination={{
          take,
          currentPageNumber: page,
          totalPages: total_pages,
        }}
      />
    </div>
  )
}
