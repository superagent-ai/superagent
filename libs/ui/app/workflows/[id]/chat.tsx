"use client"

import React, { useMemo } from "react"
import { Workflow, WorkflowStep } from "@/models/models"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { v4 as uuidv4 } from "uuid"

import { Profile } from "@/types/profile"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import Message from "@/components/message"

import FunctionCalls from "./function-calls"
import LLMDialog from "./llm-dialog"
import PromptForm from "./prompt-form"

dayjs.extend(relativeTime)

const defaultFunctionCalls = [
  {
    type: "start",
  },
]

export default function Chat({
  workflow,
  profile,
  llms,
}: {
  workflow: Workflow
  profile: Profile
  llms: any
}) {
  const workflowSteps = useMemo(
    () => workflow.steps.map((item: any) => new WorkflowStep(item)),
    [workflow]
  )
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [messages, setMessages] = React.useState<
    { type: string; message: string; steps?: Record<string, string> }[]
  >(
    workflowSteps[0]?.agent?.initialMessage
      ? [{ type: "ai", message: workflowSteps[0].agent.initialMessage }]
      : []
  )

  const [functionCalls, setFunctionCalls] = React.useState<any[]>()

  const [timer, setTimer] = React.useState<number>(0)
  const [session, setSession] = React.useState<string | null>(uuidv4())
  const [open, setOpen] = React.useState<boolean>(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const abortControllerRef = React.useRef<AbortController | null>(null)

  const resetState = () => {
    setIsLoading(false)
    setTimer(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const abortStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    resetState()
  }

  async function onSubmit(value?: string) {
    let messageByEventIds: Record<string, string> = {}
    let currentEventId = ""

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
      { type: "ai", message: "" },
    ])

    try {
      await fetchEventSource(
        `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/workflows/${workflow.id}/invoke`,
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
            console.log("close")
            setFunctionCalls((previousFunctionCalls = []) => [
              ...previousFunctionCalls,
              {
                type: "end",
              },
            ])
            resetState()
          },
          async onmessage(event) {
            if (event.id) currentEventId = event.id

            if (event.event === "function_call") {
              const data = JSON.parse(event.data)
              setFunctionCalls((previousFunctionCalls = []) => [
                ...previousFunctionCalls,
                {
                  ...data,
                  type: "function_call",
                },
              ])
            }

            if (
              event.data !== "[END]" &&
              event.event !== "function_call" &&
              currentEventId
            ) {
              if (!messageByEventIds[currentEventId])
                messageByEventIds[currentEventId] = ""

              messageByEventIds[currentEventId] +=
                event.data === "" ? `${event.data} \n` : event.data

              setMessages((previousMessages) => {
                let updatedMessages = [...previousMessages]

                for (let i = updatedMessages.length - 1; i >= 0; i--) {
                  if (updatedMessages[i].type === "ai") {
                    updatedMessages[i].steps = messageByEventIds
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
      resetState()
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

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToMessagesBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  React.useEffect(() => {
    scrollToMessagesBottom()
  }, [messages])

  return (
    <div className="h-full">
      <div className="relative flex h-full w-full bg-background text-sm">
        <div className="mt-12 flex-[20%] px-6">
          <p
            className={`${
              timer === 0 ? "text-muted-foreground" : "text-primary"
            } mb-4 font-mono text-sm`}
          >
            {timer.toFixed(1)}s
          </p>
          <FunctionCalls functionCalls={functionCalls} />
        </div>

        <div className="relative flex h-full flex-[80%] text-sm">
          <ScrollArea className="w-full pr-20">
            <div className="mb-20 flex max-w-4xl flex-1 flex-col space-y-0 px-4 py-12">
              {messages.map(({ type, message, steps }, index) => (
                <Message
                  key={index}
                  type={type}
                  message={message}
                  steps={steps}
                  profile={profile}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="absolute inset-x-0 bottom-10 z-50 h-[100px] bg-gradient-to-t from-muted from-0% to-transparent to-50%">
          <div className="relative mx-auto max-w-2xl px-8">
            <PromptForm
              onStop={() => abortStream()}
              onSubmit={async (value) => {
                onSubmit(value)
              }}
              onCreateSession={async (uuid) => {
                setSession(uuid)
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
      </div>
      <LLMDialog
        isOpen={open}
        onOpenChange={(change) => setOpen(change)}
        profile={profile}
        title="Heads up!"
        description="Before you can test this workflow you need to configure a Language Model."
      />
    </div>
  )
}
