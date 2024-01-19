"use client"

import Image from "next/image"
import { Search } from "lucide-react"
import { RxCopy, RxPlus } from "react-icons/rx"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Overview({ agent }: { agent: any }) {
  const data: any[] = []

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
            <p className="leading-none">10</p>
            <p className="text-sm text-muted-foreground">Total requests</p>
          </div>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <span>Datasources</span>
            <div className="flex items-center space-x-2">
              <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter by name..."
                    className="min-w-[300px] pl-10"
                  />
                </div>
              </div>
              <Button size="sm" className="space-x-2">
                <RxPlus />
                <span>Add</span>
              </Button>
            </div>
          </CardHeader>
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
