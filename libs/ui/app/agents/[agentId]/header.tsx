"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Agent } from "@/models/models"
import { TbTrash } from "react-icons/tb"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useEditableField } from "@/components/hooks"

type Mode = "view" | "edit"

export default function Header({
  agent,
  profile,
}: {
  agent: Agent
  profile: Profile
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false)

  const onAgentDelete = async () => {
    await api.deleteAgentById(agent.id)
    toast({
      description: `Agent with ID: ${agent.id} deleted!`,
    })
    router.refresh()
    router.push("/agents")
  }

  const onUpdateAgentName = async (name: string) => {
    await api.patchAgent(agent.id, { name })
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex flex-col">
        <div className="flex space-x-2 py-2 text-sm text-muted-foreground">
          <Link passHref href="/agents">
            <span>Agents</span>
          </Link>
          <span>/</span>
          <Badge variant="secondary">
            <div className="flex items-center space-x-1">
              <span className="font-mono font-normal text-muted-foreground">
                {agent?.id}
              </span>
            </div>
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            {useEditableField(agent.name, onUpdateAgentName)}

            <span className="font-mono text-xs font-normal text-muted-foreground">
              <span>
                CREATED AT:{" "}
                <span className="text-foreground">
                  {agent.createdAt.toString()}
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Button
          className="space-x-2"
          size="sm"
          variant="outline"
          onClick={() => setDeleteModalOpen(true)}
        >
          <TbTrash size={20} />
          <span>Delete</span>
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAgentDelete}>
              Yes, delete!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
