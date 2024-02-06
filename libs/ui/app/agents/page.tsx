import { cookies } from "next/headers"
import Link from "next/link"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export const dynamic = "force-dynamic"

export default async function Agents({
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

  const { data: agents, total_pages } = await api.getAgents({
    skip: (page - 1) * take,
    take,
  })

  return (
    <div className="flex flex-col space-y-4 px-4 py-6">
      <p className="text-lg">Agents</p>

      <Alert variant="destructive">
        <AlertTitle>Deprecated</AlertTitle>
        <AlertDescription>
          This page is deprecated and will be removed in a future release.
          <br />
          For creating new agents, please use the workflows page.{" "}
          <Link href="/workflows" className="font-bold underline">
            Click here to create a new workflows page.
          </Link>
        </AlertDescription>
      </Alert>
      <DataTable
        columns={columns}
        data={agents}
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
