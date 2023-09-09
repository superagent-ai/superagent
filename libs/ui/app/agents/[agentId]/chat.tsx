"use client"

import * as React from "react"

import { Agent } from "@/types/agent"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { PromptFooter } from "./prompt-footer"
import PromptForm from "./prompt-form"

export function Message() {
  return (
    <div className="mx-auto flex max-w-4xl space-x-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <p>
        Pick the components you need. Copy and paste the code into your project
        and customize to your needs. The code is yours.
      </p>
    </div>
  )
}

export default function Chat({ agent }: { agent: Agent }) {
  const [messages, setMessages] = React.useState([])

  return (
    <div className="flex flex-1 flex-col overflow-hidden border-r">
      <div className="flex items-center justify-between p-4">
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
      <ScrollArea className="relative flex grow flex-col px-4">
        <div className="from-background h-20 absolute inset-x-0 top-0 bg-gradient-to-b to-transparent from-0% to-50% z-50" />
        <div className="flex flex-col space-y-5 py-5">
          {[...Array(40)].map((_, index) => (
            <Message key={index} />
          ))}
        </div>
        <div className="from-background h-20 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent from-0% to-50% z-50" />
      </ScrollArea>
      <div>
        <div className="bg-background mx-auto max-w-2xl space-y-4 border-t px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
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
  )
}
