"use client"

import { useEffect } from "react"
import { useAsyncFn } from "react-use"

import { Api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface Agent {
  id: string
  profile: {
    api_key: string
    id: string
  }
}

export default function Agent({ id, profile }: Agent) {
  const api = new Api(profile.api_key)
  const [{ loading, value }, fetch] = useAsyncFn(async () => {
    const { data: runs } = await api.getRuns({ agentId: id })
    const { data: agent } = await api.getAgentById(id)
    return { agent, runs }
  }, [id])

  useEffect(() => {
    fetch()
  }, [id, fetch])

  console.log(value)
  return (
    <div className="flex flex-col space-y-2 p-6">
      <div className="flex space-x-2 text-sm text-muted-foreground">
        <span>Assistants</span>
        <span>/</span>
        <Badge variant="secondary">
          <div className="flex items-center space-x-1">
            <span className="font-mono font-normal text-muted-foreground">
              {id}
            </span>
          </div>
        </Badge>
      </div>
      <p className="text-2xl">{value?.agent.name}</p>
    </div>
  )
}
