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
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/use-toast"

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
  const [name, setName] = React.useState<string>(agent.name)
  const [mode, setMode] = React.useState<Mode>("view")
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false)

  const onAgentDelete = async () => {
    await api.deleteAgentById(agent.id)
    toast({
      description: `Agent with ID: ${agent.id} deleted!`,
    })
    router.refresh()
    router.push("/agents")
  }

  const [isLoading, setLoading] = React.useState<boolean>(false)
  const onUpdateAgentName = async (name: string) => {
    setLoading(true)
    await api.patchAgent(agent.id, { name })
    router.refresh()
    setLoading(false)
  }

  return (
    <>
      <div className="flex space-x-2 px-6 py-2 text-sm text-muted-foreground">
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
      <div className="flex items-center justify-between px-6">
        <div className="flex flex-col space-y-2">
          {mode === "edit" ? (
            <div className="flex items-center justify-between space-x-2">
              <Input
                value={name}
                onChangeCapture={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setName(event.target.value)
                }
                placeholder="My Agent"
                className="leading-0 flex-1 border-none p-0 text-2xl ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                size="sm"
                variant="secondary"
                className="h-8 py-0"
                onClick={async () => {
                  await onUpdateAgentName(name)
                  setMode("view")
                }}
              >
                {isLoading ? <Spinner /> : "Save"}
              </Button>
            </div>
          ) : (
            <p
              className="py-1 text-2xl hover:bg-muted"
              onClick={() => setMode("edit")}
            >
              {name}
            </p>
          )}

          <span className="font-mono text-xs font-normal text-muted-foreground">
            <span>
              CREATED AT:{" "}
              <span className="text-foreground">
                {agent.createdAt.toString()}
              </span>
            </span>
          </span>
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
    </>
  )
}
