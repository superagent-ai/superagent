import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export const dynamic = "force-dynamic"

export default async function API({
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

  const { data: tools, total_pages } = await api.getTools({
    skip: (page - 1) * take,
    take,
  })

  return (
    <div className="flex flex-col space-y-4 px-4 py-6">
      <p className="text-lg">APIs</p>
      <DataTable
        columns={columns}
        data={tools}
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
