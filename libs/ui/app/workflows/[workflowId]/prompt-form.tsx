"use client"

import * as React from "react"
import { RxArrowUp, RxPlus, RxStop } from "react-icons/rx"
import Textarea from "react-textarea-autosize"
import { v4 as uuid } from "uuid"

import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

export interface PromptProps {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
  onCreateSession: (value: string) => Promise<void>
  onStop: () => void
}

export default function PromptFrom({
  onSubmit,
  isLoading,
  onCreateSession,
  onStop,
}: PromptProps) {
  const [input, setInput] = React.useState<string>()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput("")
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="bg-background relative flex max-h-60 w-full grow flex-col overflow-hidden px-8 sm:rounded-md sm:border sm:px-12">
        <button
          onClick={() => {
            onCreateSession(uuid())
          }}
          className={cn(
            buttonVariants({ size: "sm", variant: "outline" }),
            "bg-background absolute left-0 top-4 h-8 w-8 rounded-full p-0 sm:left-4"
          )}
        >
          <RxPlus />
          <span className="sr-only">New Chat</span>
        </button>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-2.5 sm:right-4">
          {isLoading ? (
            <Button
              onClick={onStop}
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "mt-1 h-8 w-8 rounded-md p-0"
              )}
            >
              <RxStop size="18px" />
              <span className="sr-only">Send message</span>
            </Button>
          ) : (
            <Button
              type="submit"
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "mt-1 h-8 w-8 rounded-md p-0"
              )}
            >
              <RxArrowUp size="18px" />
              <span className="sr-only">Send message</span>
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
