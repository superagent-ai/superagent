"use client"

import * as React from "react"
import { TbX } from "react-icons/tb"
import { useAsync } from "react-use"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LogPanelType {
  onClose: () => void
  panel: string | null
}

function LogPanel({ panel, onClose }: LogPanelType) {
  const { value, loading } = useAsync(async () => {
    console.log(panel)
  }, [panel])

  return (
    <div className="absolute right-0 h-full min-w-[50%] border-l bg-background">
      <div className="flex items-center justify-between space-x-2 border-b px-6 py-2">
        <p>{panel}</p>
        <Button variant="outline" className="h-7 w-7 p-0" onClick={onClose}>
          <TbX size={20} />
        </Button>
      </div>
      <div className="px-6 py-4">
        <p>test</p>
      </div>
    </div>
  )
}

export default function Logs({ agent }: { agent: any }) {
  const [panel, setPanel] = React.useState<string | null>()

  return (
    <div className="relative flex h-full w-full overflow-auto text-xs">
      <ScrollArea className="flex-1">
        <div className="flex flex-1 flex-col space-y-0 px-4">
          {Array.from({ length: 100 }).map((_, index) => (
            <div
              key={index}
              onClick={() => setPanel(`${index}`)}
              className="flex cursor-pointer items-center space-x-0 rounded-sm p-2 hover:bg-muted"
            >
              <div className="flex-none border-r pr-4 font-mono">
                JAN 20, 11:02:03
              </div>
              <div className="flex-none border-r px-4 font-mono">
                <Badge
                  className="rounded-sm px-4 text-green-400"
                  variant="outline"
                >
                  200
                </Badge>
              </div>
              <div className="grow border-r px-4 font-mono">Block 3</div>
              <div className="grow border-r px-4 font-mono">Block 4</div>
              <div className="grow px-4 font-mono">Block 5</div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {panel && <LogPanel panel={panel} onClose={() => setPanel(null)} />}
    </div>
  )
}
