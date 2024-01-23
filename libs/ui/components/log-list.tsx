"use client"

import * as React from "react"
import Link from "next/link"
import { TbArrowDown, TbBrain, TbX } from "react-icons/tb"

import { LogItem } from "@/types/log-item"
import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Spinner } from "./ui/spinner"

interface LogPanelType {
  onClose: () => void
  panel: LogItem
}

function LogPanel({ panel, onClose }: LogPanelType) {
  return (
    <div className="absolute right-0 h-full max-w-[500px] border-l bg-background">
      <div className="flex items-center justify-between space-x-2 border-b px-6 py-2">
        <p className="font-medium">Log details</p>
        <Button variant="outline" className="h-7 w-7 p-0" onClick={onClose}>
          <TbX size={20} />
        </Button>
      </div>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between border-b py-4">
          <p className="text-muted-foreground">Timestamp</p>
          <p>
            {new Date(panel.received_at)
              .toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
              .toUpperCase()}
          </p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <p className="text-muted-foreground">ID</p>
          <p className="max-w-[70%] truncate">{panel.id}</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <p className="text-muted-foreground">User ID</p>
          <p className="max-w-[70%] truncate">{panel.user_id}</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <p className="text-muted-foreground">Agent ID</p>
          <p className="max-w-[70%] truncate">{panel.agent_id || "n/a"}</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <p className="text-muted-foreground">Session ID</p>
          <p className="max-w-[70%] truncate">{panel.session_id || "n/a"}</p>
        </div>
        <div className="flex flex-col items-start justify-start space-y-4 overflow-hidden border-b py-4">
          <p className="text-muted-foreground">Run logs</p>
          <div className="flex w-full flex-1 justify-between space-x-12">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <p className="font-mono uppercase text-muted-foreground">Input</p>
            </div>
            <p className="max-w-[70%] truncate">{panel.input || "n/a"}</p>
          </div>
          {JSON.parse(panel.intermediate_steps)?.length > 0 && (
            <div className="flex w-full flex-1 flex-col justify-between space-y-4">
              {JSON.parse(panel.intermediate_steps)?.map(
                (step: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 ">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <p className="font-mono uppercase text-muted-foreground">
                        TOOL: {step.tool}
                      </p>
                    </div>
                    <p className="max-w-[70%] truncate">
                      {JSON.stringify(step.tool_input)}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
          <div className="flex w-full flex-1 justify-between space-x-12">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <p className="font-mono uppercase text-muted-foreground">
                Output
              </p>
            </div>
            <p className="max-w-[70%] truncate">{panel.output || "n/a"}</p>
          </div>
        </div>
        {panel.agent_id && (
          <Link href={`/assistants/${panel.agent_id}`} passHref>
            <Button className="mt-8 w-full space-x-2" variant="outline">
              <TbBrain />
              <span>View assistant</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default function Logs({
  data,
  profile,
}: {
  data: Array<LogItem>
  profile: Profile
}) {
  const [logs, setLogs] = React.useState<Array<LogItem>>(data)
  const [panel, setPanel] = React.useState<LogItem | null>()
  const [isLoading, setIsLoading] = React.useState<boolean | null>(false)
  const limit = 50

  const handleLoadMore = React.useCallback(async () => {
    setIsLoading(true)
    const api = new Api(profile.api_key)
    const from_page = Math.floor(logs.length / limit)
    const to_page = from_page + 1

    const { data: newLogs } = await api.getRuns({ limit, from_page, to_page })

    setLogs((prevLogs) => [...prevLogs, ...newLogs])
    setIsLoading(false)
  }, [profile.api_key, logs])

  return (
    <div className="relative flex h-full w-full overflow-auto text-xs">
      <ScrollArea className="flex-1">
        <div className="flex flex-1 flex-col space-y-0 px-4">
          {logs.map((item: LogItem) => (
            <div
              key={item.id}
              onClick={() => setPanel(item)}
              className="flex cursor-pointer items-center space-x-0 rounded-sm p-2 hover:bg-muted"
            >
              <div className="flex-none border-r pr-12 font-mono">
                <p className="uppercase">
                  {new Date(item.received_at)
                    .toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                    .toUpperCase()}
                </p>
              </div>
              <div className="flex-none border-r px-4 font-mono">
                <Badge
                  className="rounded-sm px-4 text-green-400"
                  variant="outline"
                >
                  200
                </Badge>
              </div>
              <div className="flex-none border-r px-4 font-mono">
                <Badge
                  variant="secondary"
                  className="rounded-sm text-xs font-normal"
                >
                  user: {item.user_id}
                </Badge>
              </div>
              <div className="flex flex-1 items-start justify-start space-x-2 px-4 font-mono text-xs">
                <span className="font-medium">POST:</span>
                <span>/api/v1/agents/{item.agent_id}/invoke</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {panel && <LogPanel panel={panel} onClose={() => setPanel(null)} />}
      {data.length > 0 && (
        <div className="absolute bottom-0 flex w-full items-center justify-center bg-transparent py-10">
          <Button size="sm" className="space-x-2" onClick={handleLoadMore}>
            {isLoading ? <Spinner /> : <TbArrowDown />}
            <span>Load more</span>
          </Button>
        </div>
      )}
    </div>
  )
}
