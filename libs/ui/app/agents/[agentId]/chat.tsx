"use client"

import * as React from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { RxChatBubble, RxCode } from "react-icons/rx"
import { TbBolt } from "react-icons/tb"
import { useAsyncFn } from "react-use"
import { v4 as uuidv4 } from "uuid"

import { Agent } from "@/types/agent"
import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Message from "@/components/message"
import FunctionCalls from "@/app/workflows/[id]/function-calls"

import PromptForm from "./prompt-form"

dayjs.extend(relativeTime)

const defaultFunctionCalls = [
  {
    type: "start",
  },
]

export default function Chat({
  agent,
  profile,
}: {
  agent: Agent
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const [functionCalls, setFunctionCalls] = React.useState<any[]>()
  const [useStreaming, setUseStreaming] = React.useState<boolean>(false)

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [selectedView, setSelectedView] = React.useState<"chat" | "trace">(
    "chat"
  )
  const [messages, setMessages] = React.useState<
    { type: string; message: string; isSuccess?: boolean }[]
  >(agent.initialMessage ? [{ type: "ai", message: agent.initialMessage }] : [])
  const [timer, setTimer] = React.useState<number>(0)
  const [session, setSession] = React.useState<string | null>(uuidv4())
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const [{ loading: isLoadingRuns, value: runs = [] }, getAgentRuns] =
    useAsyncFn(async () => {
      const { data: runs } = await api.getAgentRuns(agent.id)
      return runs
    }, [agent])

  const abortControllerRef = React.useRef<AbortController | null>(null)

  const abortStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
      setTimer(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const resetState = () => {
    setIsLoading(false)
    setTimer(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
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

    if (!useStreaming) {
      setFunctionCalls(defaultFunctionCalls)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${agent.id}/invoke`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${profile.api_key}`,
          },
          body: JSON.stringify({
            input: value,
            enableStreaming: false,
            sessionId: session,
          }),
        }
      )
      const {
        data: { output, intermediate_steps },
      } = await response.json()

      if (intermediate_steps?.length > 0) {
        setFunctionCalls(defaultFunctionCalls)
      }

      setMessages((previousMessages) => {
        let updatedMessages = [...previousMessages]

        for (let i = updatedMessages.length - 1; i >= 0; i--) {
          if (updatedMessages[i].type === "ai") {
            updatedMessages[i].message = output
            updatedMessages[i].isSuccess = true
            break
          }
        }

        return updatedMessages
      })

      setFunctionCalls((previousFunctionCalls = []) => [
        ...previousFunctionCalls,
        {
          type: "function_call",
          function: intermediate_steps?.[0]?.[0].tool,
        },
        {
          type: "end",
        },
      ])

      setIsLoading(false)
      setTimer(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    } else {
      try {
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
              sessionId: session,
            }),
            openWhenHidden: true,
            signal: abortControllerRef.current.signal,

            async onopen() {
              setFunctionCalls(defaultFunctionCalls)
            },
            async onclose() {
              setFunctionCalls((previousFunctionCalls = []) => [
                ...previousFunctionCalls,
                {
                  type: "end",
                },
              ])
              resetState()
            },
            async onmessage(event) {
              if (event.data !== "[END]" && event.event !== "function_call") {
                message += event.data === "" ? `${event.data} \n` : event.data
                const isSuccess = event.event != "error"
                setMessages((previousMessages) => {
                  let updatedMessages = [...previousMessages]

                  for (let i = updatedMessages.length - 1; i >= 0; i--) {
                    if (updatedMessages[i].type === "ai") {
                      updatedMessages[i].message = message
                      updatedMessages[i].isSuccess = isSuccess
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
        setTimer(0)
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
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
  }

  const calculateRunDuration = (start_date: string, end_date: string) => {
    const startDate = new Date(start_date?.replace(" ", "T"))
    const endDate = new Date(end_date?.replace(" ", "T"))
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000
    return seconds.toFixed(1)
  }

  React.useEffect(() => {
    selectedView === "trace" && getAgentRuns()
  }, [selectedView, getAgentRuns])

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToMessagesBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  React.useEffect(() => {
    scrollToMessagesBottom()
  }, [messages])

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden border-r">
      <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4">
        <p
          className={`${
            timer === 0 ? "text-muted-foreground" : "text-primary"
          } font-mono text-sm`}
        >
          {timer.toFixed(1)}s
        </p>

        <div className="absolute right-0 z-50 flex items-center space-x-2 px-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm  text-muted-foreground">
              Streaming
            </span>
            <Switch checked={useStreaming} onCheckedChange={setUseStreaming} />
          </div>
          {functionCalls && functionCalls.length > 0 && (
            <Popover>
              <PopoverTrigger>
                <Badge variant="secondary" className="space-x-1">
                  <TbBolt className="text-lg text-green-400" />
                  <span className="font-mono">{functionCalls?.length}</span>
                </Badge>
              </PopoverTrigger>
              <PopoverContent side="bottom">
                <FunctionCalls functionCalls={functionCalls} />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/*<div className="self-end">
          <Select
            value={selectedView}
            onValueChange={(value) =>
              setSelectedView(value as "chat" | "trace")
            }
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="Chat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="trace">Trace</SelectItem>
            </SelectContent>
          </Select>
          </div>*/}
      </div>
      <ScrollArea className="relative flex grow flex-col px-4">
        <div className="absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-background from-0% to-transparent to-50%" />
        {selectedView === "chat" ? (
          <div className="mb-20 mt-2 flex flex-col space-y-5 py-5">
            <div className="container mx-auto flex max-w-4xl flex-col">
              {messages.map((message, index) => (
                <Message key={index} profile={profile} {...message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        ) : (
          <div className="container my-10 flex max-w-2xl flex-col space-y-4">
            {runs
              .filter((run: any) => run.child_run_ids)
              .map((run: any) => (
                <Card key={run.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between space-x-4">
                      <p className="flex-1">{run.inputs.input}</p>
                      <div className="mt-1 flex items-center space-x-4">
                        <p className="font-mono text-xs text-primary">
                          {run.total_tokens} tokens
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dayjs(run.start_time).fromNow()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="relative flex max-h-40 grow flex-col rounded-lg border p-3">
                      <Message
                        type="ai"
                        message={run.outputs?.output}
                        profile={profile}
                      />
                    </ScrollArea>
                    <div className="mt-2 flex flex-col space-y-2">
                      {run.child_run_ids.map((run_id: string) => {
                        const activeRun = runs.find(
                          (run: any) => run.id === run_id
                        )

                        return (
                          <div
                            key={activeRun.id}
                            className="flex items-center space-x-4"
                          >
                            <div className="flex h-8 w-8 flex-col items-center justify-center rounded-lg border">
                              {activeRun.run_type === "tool" ? (
                                <RxCode />
                              ) : (
                                <RxChatBubble />
                              )}
                            </div>
                            <Badge variant="outline">{activeRun.name}</Badge>

                            <p className="font-mono text-xs text-muted-foreground">
                              {calculateRunDuration(
                                activeRun.start_time,
                                activeRun.end_time
                              )}
                              s
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">
                              {activeRun.total_tokens} tokens
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </ScrollArea>
      {selectedView === "chat" && (
        <div className="absolute inset-x-0 bottom-0 z-50 h-20 bg-gradient-to-t from-background from-50% to-transparent to-100%">
          <div className="relative mx-auto mb-6 max-w-2xl px-8">
            <PromptForm
              onStop={() => abortStream()}
              onSubmit={async (value) => {
                onSubmit(value)
              }}
              onCreateSession={async (uuid) => {
                setSession(uuid)
                setTimer(0)
                if (timerRef.current) {
                  clearInterval(timerRef.current)
                }
                setMessages([])
                toast({
                  description: "New session created",
                })
              }}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
      <Toaster />
    </div>
  )
}
