import { cookies } from "next/headers"
import Link from "next/link"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Api } from "@/lib/api"
import { PlayIcon } from "@/components/svg/PlayIcon"

import { Dashboard } from "./components/Dashboard"

export const dynamic = "force-dynamic"

export default async function Home({
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
    <>
      {!agents ? (
        <div className="m-auto flex h-full flex-col items-center justify-center space-y-4 px-4 py-6">
          <div className="w-[300px]">
            <div className="flex flex-col justify-center gap-4">
              <h2 className="text-3xl font-bold">Hola, {profile.first_name}</h2>
              <div className="flex flex-col gap-2">
                <p className="">Bienvenido a ChatsappAI! 🤖</p>
                <p className="text-sm text-gray-300">
                  La Plataforma de Agentes de Inteligencia Artificial para
                  ecommerce de Latinoamerica 🏙🧑‍🏭
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <Link
                    className="rounded-lg bg-white p-3 text-xs text-black"
                    href="/agents"
                  >
                    <PlayIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Dashboard data={agents} />
      )}
    </>
  )
}
