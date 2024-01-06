"use client"

import { useRouter } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"
import { CodeBlock, dracula } from "react-code-blocks"
import { RxCopy } from "react-icons/rx"
import { TbLink, TbTrashX } from "react-icons/tb"

import { Agent } from "@/types/agent"
import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { cn, encodeToIdentifier } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import DeleteAgentButton from "./delete-agent-button"

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://beta.superagent.sh"
    : "http://localhost:3000"

export default function Header({
  agent,
  profile,
}: {
  agent: Agent
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    await api.deleteAgentById(agent.id)
    toast({
      description: `Agent with ID: ${agent.id} deleted!`,
    })
    router.refresh()
    router.push("/agents")
  }

  const handleCopyIdToClipboard = () => {
    navigator.clipboard.writeText(agent.id)
    toast({
      description: "Copied ID to clipboard",
    })
  }

  const embedCode = `<!-- This can be placed anywhere -->
<div id="superagent-chat"></div>

<!-- This should be placed before the 
closing </body> tag -->
<script src="https://unpkg.com/superagent-chat-embed-v01/dist/web.js"></script>
<script>
Superagent({
  authorization: "${encodeToIdentifier(agent.id, profile.api_key)}",
  type: "inline"
});
</script>`

  return (
    <>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-lg">{agent.name}</p>
        <div className="flex space-x-2">
          <DeleteAgentButton handleDelete={handleDelete} />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleCopyIdToClipboard()}
          >
            <TbLink fontSize="18px" />
          </Button>
          <Dialog>
            <DialogTrigger
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Share
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share or embed your agent</DialogTitle>
                <DialogDescription>
                  Share this agent with anyone or embed it into your
                  application.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-2">
                <p className="font-bold">Share</p>
                <div className="flex justify-between space-x-2">
                  <Input
                    value={`${baseUrl}/share/${encodeToIdentifier(
                      agent.id,
                      profile.api_key
                    )}`}
                  />
                  <Button
                    variant="secondary"
                    className="flex space-x-2"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${baseUrl}/share/${encodeToIdentifier(
                          agent.id,
                          profile.api_key
                        )}`
                      )
                      toast({
                        description: "Link copied to clipboard!",
                      })
                    }}
                  >
                    <RxCopy />
                    <p>Copy</p>
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2">
                <p className="font-bold">Embed</p>
                <p className="text-sm text-muted-foreground">
                  Copy the following code and place it before the closing body
                  tag. You can choose between inline or popup as options.
                </p>
                <div className="relative max-w-full font-mono text-sm">
                  <CodeBlock
                    text={embedCode}
                    language="html"
                    showLineNumbers
                    theme={dracula}
                    codeContainerStyle={{ width: "450px", overflow: "scroll" }}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Toaster />
    </>
  )
}
