"use client"

import React, { useMemo } from "react"
import { Workflow, WorkflowStep } from "@/models/models"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { TbBolt } from "react-icons/tb"
import { v4 as uuidv4 } from "uuid"

import { Profile } from "@/types/profile"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import Message from "@/components/message"

import LLMDialog from "./llm-dialog"
import PromptForm from "./prompt-form"
import StepsView, { StepsViewProps, StepType } from "./steps"

dayjs.extend(relativeTime)

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

  const endOfMessagesRef = React.useRef<HTMLDivElement | null>(null)
  const [timer, setTimer] = React.useState<number>(0)
  const [session, setSession] = React.useState<string | null>(uuidv4())
  const [open, setOpen] = React.useState<boolean>(false)
  const [steps, setSteps] = React.useState<StepsViewProps["steps"]>({})
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const abortControllerRef = React.useRef<AbortController | null>(null)

  const stepsCount = useMemo(
    () =>
      Object.values(steps || {}).reduce(
        (acc, functionCalls) => acc + functionCalls.length,
        0
      ),
    [steps]
  )

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
            setSteps({
              [currentEventId]: [
                {
                  type: StepType.START,
                },
              ],
            })
            resetState()
          },
          async onclose() {
            setSteps((previousSteps: any) => {
              return {
                ...previousSteps,
                [currentEventId]: [
                  ...(previousSteps?.[currentEventId] || []),
                  {
                    type: StepType.END,
                  },
                ],
              }
            })
          },
          async onmessage(event) {
            console.log(event)
            if (event.id) currentEventId = event.id

            if (event.event === "function_call") {
              const data = JSON.parse(event.data)
              setSteps((previousSteps: any) => {
                return {
                  ...previousSteps,
                  [data?.step_name]: [
                    ...(previousSteps?.[data?.step_name] || []),
                    {
                      ...data,
                      type: StepType.FUNCTION_CALL,
                    },
                  ],
                }
              })
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

  React.useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    })
  }, [messages])

  return (
    <div className="relative flex flex-1 text-sm">
      <div className="absolute right-0 z-50 flex items-center space-x-2 px-6 py-4">
        <Popover>
          <PopoverTrigger>
            <Badge variant="secondary" className="space-x-1">
              <TbBolt className="text-lg text-green-400" />
              <span className="font-mono">{stepsCount}</span>
            </Badge>
          </PopoverTrigger>
          <PopoverContent side="bottom">
            <StepsView steps={steps} />
          </PopoverContent>
        </Popover>
        <p
          className={`${
            timer === 0 ? "text-muted-foreground" : "text-primary"
          } font-mono text-sm`}
        >
          {timer.toFixed(1)}s
        </p>
      </div>
      <div className="relative flex flex-1 flex-col border-l bg-background text-sm">
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-1 flex-col space-y-0 px-4 pb-10 pt-8">
            {messages.map(({ type, message, steps }, index) => (
              <Message
                key={index}
                type={type}
                message={message}
                steps={steps}
                profile={profile}
              />
            ))}
            <div ref={endOfMessagesRef} className="pt-20" />
          </div>
        </ScrollArea>
        <div className="from-bg-background absolute bottom-0 z-50 flex w-full flex-col bg-gradient-to-t from-0% to-transparent to-50% pb-8 sm:px-5 lg:px-20">
          <div className="container max-w-4xl grow self-center px-8">
            <PromptForm
              onStop={() => abortStream()}
              onSubmit={async (value) => {
                llms.length > 0 ? onSubmit(value) : setOpen(true)
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
        workflow={workflow}
        description="Before you can test this workflow you need to configure a Language Model."
      />
    </div>
  )
}
