"use client"

import React, { PureComponent } from "react"
import Image from "next/image"
import { RxCopy } from "react-icons/rx"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Run {
  startTime: string
  totalTokens: number
}

export default function Overview({ runs, agent }: { runs: [Run]; agent: any }) {
  const llmConfig = siteConfig.llms.find(
    (llm) => llm.id === agent?.llms[0]?.llm.provider
  )
  const data =
    runs?.length > 1
      ? runs.reduce((acc: { date: string; count: number }[], run: Run) => {
          // Assuming startTime is a string in ISO format
          const date = new Date(run.startTime).toISOString().split("T")[0]
          const found = acc.find((item) => item.date === date)

          if (found) {
            found.count += 1
          } else {
            acc.push({ date, count: 1 })
          }

          return acc
        }, [])
      : []

  return (
    <div className="flex space-x-6">
      <div className="flex-1 flex-col space-y-4">
        <Card className="bg-muted">
          <CardHeader>Requests</CardHeader>
          <ResponsiveContainer width="100%" height={200} className="p-0">
            <BarChart
              width={500}
              height={300}
              data={
                data.length < 40
                  ? [...data, ...new Array(40 - data.length).fill({})]
                  : data
              }
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis tick={false} />
              <YAxis className="font-mono text-xs" orientation="right" />
              <Bar dataKey="count" fill="#0bbc4c" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-end space-x-2 px-6 pb-6 text-2xl">
            <p className="leading-none"></p>
            <p className="leading-none">{runs?.length + 1}</p>
            <p className="text-sm text-muted-foreground">Total requests</p>
          </div>
        </Card>
        <Card>
          <CardHeader>Datasources</CardHeader>
          <CardContent>
            <p>OK</p>
          </CardContent>
        </Card>
      </div>
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
