"use client"

import { Agent } from "@/types/agent"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { PromptFooter } from "./prompt-footer"
import PromptForm from "./prompt-form"

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
            <CardContent>
              <CardDescription>{agent.description}</CardDescription>
            </CardContent>
            <CardFooter>
              {agent.tools.map((tool) => (
                <Badge key={tool.id} variant="secondary">
                  {tool.tool.name}
                </Badge>
              ))}
              {agent.datasources.map((datasource) => (
                <Badge key={datasource.id} variant="secondary">
                  {datasource.datasource.name}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="relative">
        <div className=" absolute inset-x-0 bottom-0 bg-gradient-to-b from-50% to-0% pt-8">
          <div className="mx-auto sm:max-w-2xl sm:px-4">
            <div className="bg-background space-y-4 border-t px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
              <PromptForm
                onSubmit={async (value) => {
                  console.log(value)
                }}
                isLoading={false}
              />
              <PromptFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
