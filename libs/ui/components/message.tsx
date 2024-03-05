"use client"

import { motion } from "framer-motion"
import { LangfuseWeb } from "langfuse"
import { AiOutlineExclamationCircle } from "react-icons/ai"
import { TbBolt } from "react-icons/tb"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { Profile } from "@/types/profile"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

interface MessageProps {
  type: string
  message: string
  isSuccess?: boolean
  steps?: Record<string, string>
  profile: Profile
  onResubmit?: () => void
}

export default function Message({
  type,
  message,
  isSuccess = true,
  steps,
  profile,
  onResubmit,
}: MessageProps) {
  const { toast } = useToast()
  const handleCopy = () => {
    navigator.clipboard.writeText(message)
    toast({
      description: "Message copied to clipboard!",
    })
  }

  return (
    <div className="container flex flex-col space-y-1 pb-4 md:max-w-md lg:max-w-4xl">
      <div className="flex max-w-4xl space-x-4 pb-2 font-mono">
        <Avatar
          className={`h-8 w-8 rounded-md border ${
            type !== "human" && "text-green-400"
          }`}
        >
          <AvatarFallback className="rounded-md bg-background">
            {type === "human"
              ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`
              : "A"}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4 mt-2 flex-1 flex-col space-y-2 overflow-hidden px-1">
          {message?.length === 0 && !steps && <PulsatingCursor />}
          {isSuccess ? (
            <>
              {steps
                ? Object.entries(steps).map(([key, value], index) => (
                    <Accordion defaultValue={key} type="single" collapsible>
                      <AccordionItem value={key} className="border-muted">
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
            </>
          ) : (
            <MessageAlert error={message} />
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

interface MessageAlertProps {
  error: string
}

function MessageAlert({ error }: MessageAlertProps) {
  return (
    <Alert className="bg-destructive/10" variant="destructive">
      <AiOutlineExclamationCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <b>{error}</b>
      </AlertDescription>
    </Alert>
  )
}
