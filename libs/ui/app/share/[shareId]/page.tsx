import { Api } from "@/lib/api"
import { decodeFromIdentifier } from "@/lib/utils"

import Chat from "./chat"

export const dynamic = "force-dynamic"

const sanitizeKey = (key: string) => {
  return key.replace(/[^\x20-\x7E]/g, "")
}

export default async function Share({ params }: { params: any }) {
  const { shareId } = params
  const { agentId, apiKey } = decodeFromIdentifier(shareId)
  const api = new Api(sanitizeKey(apiKey))
  const { data: agent } = await api.getAgentById(agentId)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex grow overflow-auto">
        <Chat agent={agent} apiKey={sanitizeKey(apiKey)} />
      </div>
    </div>
  )
}
