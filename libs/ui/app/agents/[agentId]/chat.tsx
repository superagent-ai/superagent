"use client"

import { Agent } from "@/types/agent"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Chat({ agent }: { agent: Agent }) {
  return (
    <div className="flex flex-1 flex-col border-r ">
      <div className="flex justify-between p-4">
        <p className="text-muted-foreground">Idle</p>
        <div className="self-end">
          <Select>
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Messages</SelectItem>
              <SelectItem value="light">Trace</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="container max-w-lg">
          <Card className="min-w-lg">
            <CardHeader>{agent.name}</CardHeader>
            <CardContent></CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
      </div>
      <div className="min-h-[120px] border-t">
        <p>OK</p>
      </div>
    </div>
  )
}
