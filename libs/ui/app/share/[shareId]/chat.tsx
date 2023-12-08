/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { motion } from "framer-motion"
import { LangfuseWeb } from "langfuse"
import { GoThumbsdown, GoThumbsup } from "react-icons/go"
import { RxChatBubble, RxCopy } from "react-icons/rx"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { v4 as uuidv4 } from "uuid"

import { Agent } from "@/types/agent"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { CodeBlock } from "@/components/codeblock"
import { MemoizedReactMarkdown } from "@/components/markdown"
import PromptForm from "@/app/agents/[agentId]/prompt-form"

dayjs.extend(relativeTime)

let langfuseWeb: LangfuseWeb | null = null

if (process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY) {
  langfuseWeb = new LangfuseWeb({
    publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY,
    baseUrl:
      process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL || "https://cloud.langfuse.com",
  })
}

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
  agent,
}: {
  type: string
  message: string
  agent: Agent
}) {
  const { toast } = useToast()
  const handleFeedback = async (value: number) => {
    if (!langfuseWeb) {
      return
    }

    await langfuseWeb.score({
      traceId: agent.id,
      name: "user-feedback",
      value,
      comment: "I like how personalized the response is",
    })

    toast({
      description: "Feedback submitted!",
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message)
    toast({
      description: "Message copied to clipboard!",
    })
  }

  return (
    <div className="flex flex-col space-y-1 pb-4">
      <div className="min-w-4xl flex max-w-4xl space-x-4 pb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={type === "ai" ? agent?.avatar || "/logo.png" : undefined}
          />
          <AvatarFallback>
            <RxChatBubble />
          </AvatarFallback>
        </Avatar>
        <div className="ml-4 mt-1 flex-1 flex-col space-y-2 overflow-hidden px-1">
          {message?.length === 0 && <PulsatingCursor />}
          <MemoizedReactMarkdown
            className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words text-sm"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              table({ children }) {
                return (
                  <div className="mb-2 rounded-md border">
                    <Table>{children}</Table>
                  </div>
                )
              },
              thead({ children }) {
                return <TableHeader>{children}</TableHeader>
              },
              tbody({ children }) {
                return <TableBody>{children}</TableBody>
              },
              tr({ children }) {
                return <TableRow>{children}</TableRow>
              },
              th({ children }) {
                return <TableHead className="py-2">{children}</TableHead>
              },
              td({ children }) {
                return <TableCell className="py-2">{children}</TableCell>
              },
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
                return (
                  <ol className="mb-5 list-decimal pl-[30px]">{children}</ol>
                )
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
                      <span className="mt-1 animate-pulse cursor-default">
                        ▍
                      </span>
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
          {type === "ai" && message.length > 0 && (
            <div className="flex space-x-2 ">
              {langfuseWeb && (
                <div className="flex space-x-2 ">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFeedback(1)}
                    className="rounded-lg"
                  >
                    <GoThumbsup size="15px" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFeedback(0)}
                    className="rounded-lg"
                  >
                    <GoThumbsdown size="15px" />
                  </Button>
                </div>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy()}
                className="rounded-lg"
              >
                <RxCopy size="15px" />
              </Button>
            </div>
          )}
        </div>
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
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [messages, setMessages] = React.useState<
    { type: string; message: string }[]
  >(agent.initialMessage ? [{ type: "ai", message: agent.initialMessage }] : [])
  const [session, setSession] = React.useState<string | null>(uuidv4())
  const { toast } = useToast()

  const abortControllerRef = React.useRef<AbortController | null>(null)

  const abortStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }

  async function onSubmit(value: string) {
    let message = ""

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create a new AbortController for the new request
    abortControllerRef.current = new AbortController()

    setIsLoading(true)

    setMessages((previousMessages: any) => [
      ...previousMessages,
      { type: "human", message: value },
    ])

    setMessages((previousMessages) => [
      ...previousMessages,
      { type: "ai", message },
    ])

    try {
      await fetchEventSource(
        `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${agent?.id}/invoke`,
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
          signal: abortControllerRef.current.signal,
          async onclose() {
            setIsLoading(false)
          },
          async onmessage(event) {
            if (event.data !== "[END]" && event.event !== "function_call") {
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
          onerror(error) {
            throw error
          },
        }
      )
    } catch {
      setIsLoading(false)
      setMessages((previousMessages) => {
        let updatedMessages = [...previousMessages]

        for (let i = updatedMessages.length - 1; i >= 0; i--) {
          if (updatedMessages[i].type === "ai") {
            updatedMessages[i].message =
              "An error occured with your agent, please contact support."
            break
          }
        }

        return updatedMessages
      })
    }
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden border-r">
      <ScrollArea className="relative flex grow flex-col px-4">
        <div className="from-background absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-0% to-transparent to-50%" />
        {messages.length === 0 && (
          <div className="mb-20 mt-10 flex flex-col space-y-5 py-5">
            <div className="container mx-auto flex max-w-lg flex-col space-y-5">
              <Card>
                <CardHeader>
                  <img
                    className="mb-5 rounded-lg"
                    src={agent?.avatar || "/logo.png"}
                    width={60}
                    height={60}
                    alt={agent?.name}
                  />
                  <CardTitle className="text-md">{agent?.name}</CardTitle>
                  <CardDescription>{agent?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mt-6 text-xs">
                    Powered by{" "}
                    <a
                      href="https://www.superagent.sh"
                      className="text-primary"
                    >
                      Superagent.sh
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        <div className="mb-20 mt-10 flex flex-col space-y-5 py-5">
          <div className="container mx-auto flex max-w-4xl flex-col">
            {messages.map(({ type, message }, index) => (
              <Message
                key={index}
                type={type}
                message={message}
                agent={agent}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="from-background absolute inset-x-0 bottom-0 z-50 h-20 bg-gradient-to-t from-50% to-transparent to-100%">
        <div className="relative mx-auto mb-6 max-w-2xl px-8">
          <PromptForm
            onStop={() => abortStream()}
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
            isLoading={isLoading}
          />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
