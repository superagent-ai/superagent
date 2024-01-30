"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { LogItem } from "@/types/log-item"
import { Card, CardHeader } from "@/components/ui/card"

export default function Overview({ data }: { profile: any; data: LogItem[] }) {
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
      <div className="mt-8 flex-1 flex-col space-y-4">
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
      </div>
    </div>
  )
}
