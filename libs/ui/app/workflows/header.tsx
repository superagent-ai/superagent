"use client"

import { useRouter } from "next/navigation"
import { TbPlus } from "react-icons/tb"
import { useAsyncFn } from "react-use"

import { Profile } from "@/types/profile"
import { initialSamlValue } from "@/config/saml"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function Header({ profile }: { profile: Profile }) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const [{ loading }, createWorkflow] = useAsyncFn(async () => {
    const { data: workflow } = await api.createWorkflow({
      name: "My Workflow",
      description: "My new workflow",
    })
    await api.generateWorkflow(workflow.id, initialSamlValue)
    router.push(`/workflows/${workflow.id}`)
  })

  return (
    <div className="font-mediu flex items-center justify-between border-b px-6 py-3">
      <span>Workflows</span>
      <Button size="sm" className="space-x-2" onClick={createWorkflow}>
        {loading ? <Spinner /> : <TbPlus />}
        <span>New workflow</span>
      </Button>
    </div>
  )
}
