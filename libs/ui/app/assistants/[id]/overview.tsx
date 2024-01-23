"use client"

import { TbCopy } from "react-icons/tb"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { LogItem } from "@/types/log-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import Datasources from "./datasources"

export default function Overview({
  agent,
  profile,
  data,
}: {
  agent: any
  profile: any
  data: LogItem[]
}) {
  const chartData = data.reduce(
    (acc: Record<string, number>, logItem) => {
      const dateObject = new Date(logItem.received_at)
      const date = `${dateObject.getFullYear()}-${String(
        dateObject.getMonth() + 1
      ).padStart(2, "0")}-${String(dateObject.getDate()).padStart(2, "0")}`
      acc[date] = (acc[date] || 0) + 1

      return acc
    },
    {} as Record<string, number>
  )

  const chartDataArray = Object.entries(chartData).map(([date, count]) => ({
    date,
    count,
  }))

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
                chartDataArray.length < 40
                  ? [...chartDataArray, ...new Array(40 - data.length).fill({})]
                  : chartDataArray
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
            <p className="leading-none">{data.length}</p>
            <p className="text-sm text-muted-foreground">Total requests</p>
          </div>
        </Card>
        <Datasources agent={agent} profile={profile} />
      </div>
      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader className="pb-2 font-medium">API endpoint</CardHeader>
          <CardContent className="max-w-[300px] pt-0 lg:max-w-[400px]">
            <div className="flex max-w-[300px] items-center space-x-2 pt-0 lg:max-w-[400px]">
              <span className="font-mono text-sm text-green-400">POST</span>
              <span className="overflow-hidden overflow-ellipsis whitespace-nowrap font-mono text-sm text-muted-foreground">
                https://api.beta.superagent.sh/api/v1/agents/{agent?.id}
                /invoke
              </span>
              <Button variant="outline" size="sm" className="flex-1">
                <TbCopy size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 font-medium">Prompt</CardHeader>
          <CardContent className="max-w-[300px] pt-0 lg:max-w-[400px]">
            <div className="flex space-x-2 text-muted-foreground">
              {agent.prompt}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
