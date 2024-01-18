"use client"

import { useEffect } from "react"
import { useAsyncFn } from "react-use"

import { Api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface Agent {
  agent: any
  profile: {
    api_key: string
    id: string
  }
}

export default function Agent({ agent, profile }: Agent) {
  const api = new Api(profile.api_key)
  const [{ loading, value }, fetch] = useAsyncFn(async () => {
    const { data: runs } = await api.getRuns({ agentId: agent.id })
    return runs
  }, [api, agent])

  useEffect(() => {
    fetch()
  }, [fetch])

  console.log(agent)

  return (
    <div className="flex flex-col space-y-5 p-6">
      <div className="flex space-x-2 text-sm text-muted-foreground">
        <span>Assistants</span>
        <span>/</span>
        <Badge variant="secondary">
          <div className="flex items-center space-x-1">
            <span className="font-mono font-normal text-muted-foreground">
              {agent?.id}
            </span>
          </div>
        </Badge>
      </div>
      <div className="flex flex-col space-y-2">
        <p className="text-2xl">{agent?.name}</p>
        <div className="flex space-x-6">
          <span className="font-mono text-xs font-normal text-muted-foreground">
            <span>
              MODEL: <span className="text-foreground">{agent?.llmModel}</span>
            </span>
          </span>
          <span className="font-mono text-xs font-normal text-muted-foreground">
            <span>
              CREATED AT:{" "}
              <span className="text-foreground">{agent?.createdAt}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
