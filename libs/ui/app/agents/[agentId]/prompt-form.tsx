"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { RxPaperPlane, RxPlus } from "react-icons/rx"
import Textarea from "react-textarea-autosize"

import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

export interface PromptProps {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export default function PromptFrom({ onSubmit, isLoading }: PromptProps) {
  const [input, setInput] = React.useState<string>()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

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
          onClick={(e) => {
            e.preventDefault()
            router.refresh()
            router.push("/")
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
          <Button
            type="submit"
            size="icon"
            variant="secondary"
            disabled={isLoading || input === ""}
          >
            <RxPaperPlane />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
