"use client"

import * as React from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useAsyncFn } from "react-use"
import { v4 as uuidv4 } from "uuid"

import { Agent } from "@/types/agent"
import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Message from "@/components/message"

import PromptForm from "./prompt-form"

dayjs.extend(relativeTime)

export default function Chat({
  workflow,
  profile,
}: {
  workflow: any
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [selectedView, setSelectedView] = React.useState<"chat" | "trace">(
    "chat"
  )
  const [messages, setMessages] = React.useState<
    { type: string; message: string; isSuccess?: boolean }[]
  >(agent.initialMessage ? [{ type: "ai", message: agent.initialMessage }] : [])
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
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
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
          async onclose() {
            setIsLoading(false)
            if (timerRef.current) {
              clearInterval(timerRef.current)
            }
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

  return (
    <div className="relative flex h-full w-full flex-[60%] bg-muted text-sm">
      <ScrollArea className="w-[100%]">
        <div className="mx-auto mb-20 flex max-w-4xl flex-1 flex-col space-y-0 px-4 py-12">
          {messages.map((message, index) => (
            <Message key={index} profile={profile} {...message} />
          ))}
        </div>
      </ScrollArea>
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
  )
}
