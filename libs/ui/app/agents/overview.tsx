"use client"

import Image from "next/image"
import { RxCopy } from "react-icons/rx"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Overview({ runs, agent }: { runs: any; agent: any }) {
  const llmConfig = siteConfig.llms.find(
    (llm) => llm.id === agent?.llms[0]?.llm.provider
  )

  return (
    <div className="flex">
      <div className="flex-1 flex-col">Hello</div>
      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader className="pb-2 font-medium">API endpoint</CardHeader>
          <CardContent className="w-[400px] pt-0">
            <div className="flex  items-center space-x-2">
              <span className="font-mono text-sm text-green-400">POST</span>
              <span className="overflow-hidden overflow-ellipsis whitespace-nowrap font-mono text-sm text-muted-foreground">
                https://api.beta.superagent.sh/api/v1/agents/{agent?.id}/invoke
              </span>
              <Button variant="outline" size="sm" className="flex-1">
                <RxCopy />
              </Button>
            </div>
          </CardContent>
        </Card>
        {llmConfig && (
          <Card>
            <CardHeader className="pb-2 font-medium">LLM Provider</CardHeader>
            <CardContent className="w-[400px] pt-0">
              <div className="flex space-x-2">
                <Image
                  src={llmConfig.logo || ""}
                  width="20"
                  height="20"
                  alt={llmConfig.name || ""}
                />
                <span>{llmConfig.name}</span>
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-2 font-medium">Prompt</CardHeader>
          <CardContent className="w-[400px] pt-0">
            <div className="flex space-x-2 text-muted-foreground">
              {agent.prompt}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
