"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RxActivityLog, RxPieChart, RxPlay } from "react-icons/rx"
import { TbTrash } from "react-icons/tb"
import { useAsync } from "react-use"

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
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import LogList from "../../../components/log-list"
import Chat from "./chat"
import Overview from "./overview"
import Saml from "./saml"

interface Agent {
  agent: any
  profile: any
}

export default function AssistantsDetail({ agent, profile }: Agent) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const [open, setOpen] = React.useState<boolean>(false)
  const { value: logs, loading } = useAsync(async () => {
    const { data } = await api.getRuns({ agent_id: agent.id, limit: 1000 })
    return data
  }, [agent])

  return agent ? (
    <div className="flex max-h-screen flex-1 flex-col space-y-5 pt-6">
      <div className="flex space-x-2 px-6 text-sm text-muted-foreground">
        <Link passHref href="/workflows">
          <span>Workflows</span>
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
          <p className="text-2xl">{agent?.name}</p>
          <div className="flex space-x-6">
            <span className="font-mono text-xs font-normal text-muted-foreground">
              <span>
                MODEL:{" "}
                <span className="text-foreground">
                  {agent?.llmModel} ({agent?.llms[0]?.llm.provider})
                </span>
              </span>
            </span>
            <span className="font-mono text-xs font-normal text-muted-foreground">
              <span>
                CREATED AT:{" "}
                <span className="text-foreground">{agent?.createdAt}</span>
              </span>
            </span>
          </div>
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <Button
            className="space-x-2"
            size="sm"
            variant="outline"
            onClick={() => setOpen(true)}
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
              <AlertDialogAction
                onClick={async () => {
                  await api.deleteAgentById(agent.id)
                  router.push("/assistants")
                }}
              >
                Yes, delete!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Tabs defaultValue="saml" className="flex-1 space-y-0 overflow-hidden">
        <TabsList className="px-6 py-1.5">
          <TabsTrigger value="saml" className="space-x-1">
            <RxPlay size={12} />
            <span>EDIT</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="space-x-1">
            <RxPieChart size={12} />
            <span>STATS</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="space-x-1">
            <RxActivityLog size={12} />
            <span>LOGS</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="px-6 py-2 text-sm">
          <Overview agent={agent} profile={profile} data={logs || []} />
        </TabsContent>
        <TabsContent value="logs" className="h-full text-sm">
          {loading ? (
            <div className="flex flex-col space-y-4 p-6">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <LogList profile={profile} data={logs || []} />
          )}
        </TabsContent>
        <TabsContent value="saml" className="flex h-full text-sm">
          <Chat agent={agent} profile={profile} />
          <Saml />
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center">
      <p className="text-sm font-medium">No assistant selected</p>
      <p className="text-sm">
        View details about an assistant by navigating the list to the left
      </p>
    </div>
  )
}
