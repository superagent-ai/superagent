"use client"

import { motion } from "framer-motion"
import { LangfuseWeb } from "langfuse"
import { GoThumbsdown, GoThumbsup } from "react-icons/go"
import { RxCopy, RxReload } from "react-icons/rx"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { Profile } from "@/types/profile"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { CodeBlock } from "@/components/codeblock"
import { MemoizedReactMarkdown } from "@/components/markdown"

import { Badge } from "./ui/badge"

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

export default function Message({
  traceId,
  type,
  message,
  steps,
  profile,
  onResubmit,
}: {
  traceId: string
  type: string
  message: string
  steps?: Record<string, string>
  profile: Profile
  onResubmit?: () => void
}) {
  const { toast } = useToast()
  const handleFeedback = async (value: number) => {
    if (!langfuseWeb) {
      return
    }

    await langfuseWeb.score({
      traceId,
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
      <div className="min-w-4xl flex max-w-4xl space-x-4  pb-2">
        <Avatar className="h-8 w-8 rounded-md">
          <AvatarImage src={type === "ai" ? "/logo.png" : undefined} />
          <AvatarFallback className="rounded-md">
            {type === "human" &&
              `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4 mt-1 flex-1 flex-col space-y-2 overflow-hidden px-1">
          {message?.length === 0 && !steps && <PulsatingCursor />}
          {steps
            ? Object.entries(steps).map(([key, value], index) => (
                <Accordion
                  defaultValue={Object.keys(steps)[0]}
                  type="single"
                  collapsible
                >
                  <AccordionItem value={key}>
                    <AccordionTrigger
                      className={`mb-4 py-0 text-sm hover:no-underline ${
                        index > 0 && "mt-2"
                      }`}
                    >
                      <p className="font-semibold">{key}</p>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CustomMarkdown message={value} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            : message && <CustomMarkdown message={message} />}
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
              {onResubmit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onResubmit}
                  className="rounded-lg"
                >
                  <RxReload size="15px" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface CustomMarkdownProps {
  message: string
}

const CustomMarkdown = ({ message }: CustomMarkdownProps) => {
  return (
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
          return <ol className="mb-5 list-decimal pl-[30px]">{children}</ol>
        },
        ul({ children }) {
          return <ul className="mb-5 list-disc pl-[30px]">{children}</ul>
        },
        li({ children }) {
          return <li className="pb-1">{children}</li>
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
  )
}
