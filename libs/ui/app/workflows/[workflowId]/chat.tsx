"use client"

import React, { useMemo } from "react"
import { Workflow, WorkflowStep } from "@/models/models"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { v4 as uuidv4 } from "uuid"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Message from "@/components/message"

import PromptForm from "./prompt-form"

dayjs.extend(relativeTime)

export default function Chat({
  workflowData,
  workflowStepsData,
  profile,
}: {
  workflowData: any
  workflowStepsData: any[]
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const workflow = new Workflow(workflowData)
  const workflowSteps = useMemo(
    () => workflowStepsData.map((item: any) => new WorkflowStep(item)),
    [workflowStepsData]
  )

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [selectedView, setSelectedView] = React.useState<"chat" | "trace">(
    "chat"
  )

  const [messages, setMessages] = React.useState<
    { type: string; message: string; steps?: Record<string, string> }[]
  >(
    workflowSteps[0]?.agent?.initialMessage
      ? [{ type: "ai", message: workflowSteps[0].agent.initialMessage }]
      : []
  )
  const [timer, setTimer] = React.useState<number>(0)
  const [session, setSession] = React.useState<string | null>(uuidv4())
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

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

  async function onSubmit(value: string) {
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
          async onclose() {
            setIsLoading(false)
            setTimer(0)
            if (timerRef.current) {
              clearInterval(timerRef.current)
            }
          },
          async onmessage(event) {
            if (event.id) currentEventId = event.id

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

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToMessagesBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToMessagesBottom()
  }, [messages])

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
      </div>
      <ScrollArea className="relative flex grow flex-col px-4">
        <div className="absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-background from-0% to-transparent to-50%" />
        <div className="mb-20 mt-10 flex flex-col space-y-5 py-5">
          <div className="container mx-auto flex max-w-4xl flex-col">
            {messages.map(({ type, message, steps }, index) => (
              <Message
                key={index}
                traceId={workflow?.id}
                type={type}
                message={message}
                steps={steps}
                profile={profile}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
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
