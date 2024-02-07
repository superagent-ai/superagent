"use client"

import { useRouter } from "next/navigation"

import { Agent } from "@/types/agent"
import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import DeleteAgentButton from "./delete-agent-button"

export default function Header({
  agent,
  profile,
}: {
  agent: Agent
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    await api.deleteAgentById(agent.id)
    toast({
      description: `Agent with ID: ${agent.id} deleted!`,
    })
    router.refresh()
    router.push("/agents")
  }

  return (
    <>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-lg">{agent.name}</p>
        <div className="flex space-x-2">
          <DeleteAgentButton handleDelete={handleDelete} />
        </div>
      </div>
      <Toaster />
    </>
  )
}
