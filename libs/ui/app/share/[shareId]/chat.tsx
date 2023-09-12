"use client"

import * as React from "react"
import Image from "next/image"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { motion } from "framer-motion"
import { RxChatBubble } from "react-icons/rx"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { Agent } from "@/types/agent"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { CodeBlock } from "@/components/codeblock"
import { MemoizedReactMarkdown } from "@/components/markdown"
import PromptForm from "@/app/agents/[agentId]/prompt-form"

dayjs.extend(relativeTime)

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

export function Message({ type, message }: { type: string; message: string }) {
  return (
    <div className="min-w-4xl flex max-w-4xl space-x-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={type === "ai" ? "/logo.png" : undefined} />
        <AvatarFallback>
          <RxChatBubble />
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 mt-1 flex-1 space-y-2 overflow-hidden px-1">
        {message?.length === 0 && <PulsatingCursor />}
        <MemoizedReactMarkdown
          className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words text-sm"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-5">{children}</p>
            },
            a({ children, href }) {
              return (
                <a
                  href={href}
                  className="text-primary underline"
                  rel="noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              )
            },
            ol({ children }) {
              return <ol className="mb-5 list-decimal pl-[30px]">{children}</ol>
            },
            ul({ children }) {
              return <ul className="mb-5 list-disc pl-[30px]">{children}</ul>
            },
            li({ children }) {
              return <li className="pb-2">{children}</li>
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
                  <code
                    className="light:bg-slate-200 px-1 text-sm dark:bg-slate-800"
                    {...props}
                  >
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
  apiKey,
}: {
  agent: Agent
  apiKey: string
}) {
  const [messages, setMessages] = React.useState<
    { type: string; message: string }[]
  >([])
  const [session, setSession] = React.useState<string | null>(null)
  const { toast } = useToast()

  async function onSubmit(value: string) {
    let message = ""

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
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: value,
          enableStreaming: true,
          sessionId: session,
        }),
        openWhenHidden: true,
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
      <ScrollArea className="relative flex grow flex-col px-4">
        <div className="from-background absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-0% to-transparent to-50%" />
        {messages.length === 0 && (
          <div className="mb-20 mt-10 flex flex-col items-center justify-center space-y-5 py-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-md">{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  {agent.tools.map((tool) => (
                    <Badge variant="outline" key={tool.id}>
                      {tool.tool.name}
                    </Badge>
                  ))}
                  {agent.datasources.map((datasource) => (
                    <Badge variant="outline" key={datasource.id}>
                      {datasource.datasource.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground mt-6 text-xs">
                  Powered by{" "}
                  <a href="https://www.superagent.sh" className="text-primary">
                    Superagent.sh
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        <div className="mb-20 mt-10 flex flex-col space-y-5 py-5">
          <div className="container mx-auto flex max-w-4xl flex-col space-y-5">
            {messages.map(({ type, message }, index) => (
              <Message key={index} type={type} message={message} />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="from-background absolute inset-x-0 bottom-0 z-50 h-20 bg-gradient-to-t from-50% to-transparent to-100%">
        <div className="relative mx-auto mb-6 max-w-2xl px-8">
          <PromptForm
            onSubmit={async (value) => {
              onSubmit(value)
            }}
            onCreateSession={async (uuid) => {
              setSession(uuid)
              setMessages([])
              toast({
                description: "New session created",
              })
            }}
            isLoading={false}
          />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
