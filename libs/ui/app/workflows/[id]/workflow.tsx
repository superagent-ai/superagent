"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RxActivityLog, RxPieChart, RxPlay } from "react-icons/rx"
import { TbTrash } from "react-icons/tb"
import { useAsync, useAsyncFn } from "react-use"

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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import LogList from "../../../components/log-list"
import Chat from "./chat"
import LLMDialog from "./llm-dialog"
import Overview from "./overview"
import Saml from "./saml"

export default function WorkflowDetail({
  workflow,
  profile,
  llms,
}: {
  profile: any
  workflow: any
  llms: any
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const [name, setName] = React.useState<string>(workflow.name)
  const [editName, setEditName] = React.useState<boolean>(false)
  const [open, setOpen] = React.useState<boolean>(false)
  const [isLLMModalOpen, setIsLLMModalOpen] = React.useState<boolean>(
    llms.length === 0
  )
  const { value: logs, loading } = useAsync(async () => {
    const { data } = await api.getRuns({
      workflow_id: workflow.id,
      limit: 1000,
    })
    return data
  }, [workflow])

  const [{ loading: isEditingName }, updateName] = useAsyncFn(async (name) => {
    await api.patchWorkflow(workflow.id, {
      ...workflow,
      name,
    })
    router.refresh()
  })

  return (
    <div className="flex max-h-screen flex-1 flex-col space-y-5 pt-6">
      <LLMDialog
        isOpen={isLLMModalOpen}
        onOpenChange={(change: any) => setIsLLMModalOpen(change)}
        profile={profile}
        workflow={workflow}
        title="Configure a Language Model"
        description="Before you can start creating your first worflow you need to configure a Language Model from one of the options below."
      />
      <div className="flex space-x-2 px-6 text-sm text-muted-foreground">
        <Link passHref href="/workflows">
          <span>Workflows</span>
        </Link>
        <span>/</span>
        <Badge variant="secondary">
          <div className="flex items-center space-x-1">
            <span className="font-mono font-normal text-muted-foreground">
              {workflow?.id}
            </span>
          </div>
        </Badge>
      </div>
      <div className="flex items-center justify-between px-6">
        <div className="flex flex-col space-y-2">
          {editName ? (
            <div className="flex items-center justify-between space-x-2">
              <Input
                value={name}
                onChangeCapture={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setName(event.target.value)
                }
                placeholder="My Worflow"
                className="leading-0 flex-1 border-none p-0 text-2xl ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                size="sm"
                variant="secondary"
                className="h-8 py-0"
                onClick={async () => {
                  await updateName(name)
                  setEditName(false)
                }}
              >
                {isEditingName ? <Spinner /> : "Save"}
              </Button>
            </div>
          ) : (
            <p
              className="py-1 text-2xl hover:bg-muted"
              onClick={() => setEditName(true)}
            >
              {workflow?.name}
            </p>
          )}

          <span className="font-mono text-xs font-normal text-muted-foreground">
            <span>
              CREATED AT:{" "}
              <span className="text-foreground">{workflow.createdAt}</span>
            </span>
          </span>
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
                  await api.deleteWorkflow(workflow.id)
                  router.push("/workflows")
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
          <Overview profile={profile} data={logs || []} />
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
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={30}>
              <Chat workflow={workflow} profile={profile} llms={llms} />
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className="w-2 rounded-lg bg-muted-foreground/5 transition-colors duration-500 data-[resize-handle-active]:bg-muted-foreground/50"
            />
            <ResizablePanel maxSize={50} defaultSize={40}>
              <Saml workflow={workflow} profile={profile} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
      </Tabs>
    </div>
  )
}
