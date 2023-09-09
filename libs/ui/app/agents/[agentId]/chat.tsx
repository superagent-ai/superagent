"use client"

import * as React from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { motion } from "framer-motion"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { Agent } from "@/types/agent"
import { Profile } from "@/types/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CodeBlock } from "@/components/codeblock"
import { MemoizedReactMarkdown } from "@/components/markdown"

import PromptForm from "./prompt-form"

function PulsatingCursor() {
  return (
    <motion.div
      initial="start"
      animate={{
        scale: [1, 1, 1],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
      }}
    >
      ▍
    </motion.div>
  )
}

export function Message({
  type,
  message,
  profile,
}: {
  type: string
  message: string
  profile: Profile
}) {
  return (
    <div className="min-w-4xl flex max-w-4xl space-x-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={type === "ai" ? "/logo.png" : undefined} />
        <AvatarFallback>
          {type === "human" &&
            `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {message.length === 0 && <PulsatingCursor />}
        <MemoizedReactMarkdown
          className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-5 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == "▍") {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace("`▍`", "▍")
              }

              const match = /language-(\w+)/.exec(className || "")

              if (inline) {
                return (
                  <code className="px-1 dark:bg-slate-800" {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              )
            },
          }}
        >
          {message}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}

export default function Chat({
  agent,
  profile,
}: {
  agent: Agent
  profile: Profile
}) {
  const [messages, setMessages] = React.useState<
    { type: string; message: string }[]
  >([])
  const [timer, setTimer] = React.useState<number>(0)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  async function onSubmit(value: string) {
    let message = ""

    setTimer(0)
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 0.1)
    }, 100)

    setMessages((previousMessages: any) => [
      ...previousMessages,
      { type: "human", message: value },
    ])

    setMessages((previousMessages) => [
      ...previousMessages,
      { type: "ai", message },
    ])

    await fetchEventSource(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${agent.id}/invoke`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${profile.api_key}`,
        },
        body: JSON.stringify({
          input: value,
          enableStreaming: true,
        }),
        openWhenHidden: true,
        async onclose() {
          setTimer(0)
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        },
        async onmessage(event) {
          if (event.data !== "[END]") {
            message += event.data === "" ? `${event.data} \n` : event.data
            setMessages((previousMessages) => {
              let updatedMessages = [...previousMessages]

              for (let i = updatedMessages.length - 1; i >= 0; i--) {
                if (updatedMessages[i].type === "ai") {
                  updatedMessages[i].message = message
                  break
                }
              }

              return updatedMessages
            })
          }
        },
      }
    )
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden border-r">
      <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between p-4">
        <p
          className={`${
            timer === 0 ? "text-muted-foreground" : "text-primary"
          } font-mono text-sm`}
        >
          {timer.toFixed(1)}s
        </p>
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
        <div className="from-background absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-0% to-transparent to-50%" />
        <div className="mb-20 mt-10 flex flex-col space-y-5 py-5">
          <div className="container mx-auto flex max-w-4xl flex-col space-y-5">
            {messages.map(({ type, message }) => (
              <Message type={type} message={message} profile={profile} />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="from-background absolute inset-x-0 bottom-0 z-50 h-20 bg-gradient-to-t from-50% to-transparent to-100%">
        <div className="mx-auto mb-6 max-w-2xl">
          <PromptForm
            onSubmit={async (value) => {
              onSubmit(value)
            }}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  )
}
