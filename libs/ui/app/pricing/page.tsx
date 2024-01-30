import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { CardPrice } from "./components/CardPrice"
import { DataTable } from "./data-table"

export default async function Pricing() {
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
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              SuperAgent Elite Membership
            </h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Con <span className="font-bold">SuperAgent Elite Membership</span> no solo mejoras tu eficiencia y organización, sino que también elevas tu experiencia de trabajo a un nivel superior. ¡Únete hoy y transforma tu manera de trabajar!
            </p>
          </div>
          <DataTable />
        </div>
      </section>
    </div>
  )
}
