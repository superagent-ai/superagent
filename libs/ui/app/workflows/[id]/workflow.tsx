"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { RxActivityLog, RxPieChart, RxPlay } from "react-icons/rx"
import { useAsync } from "react-use"

import { Api } from "@/lib/api"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import LogList from "../../../components/log-list"
import Chat from "./chat"
import Header from "./header"
import LLMDialog from "./llm-dialog"
import Overview from "./overview"

const Saml = dynamic(() => import("./saml"), {
  ssr: false,
})

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

      <Header workflow={workflow} profile={profile} />

      <Tabs
        defaultValue="saml"
        className="flex flex-1 flex-col space-y-0 overflow-hidden"
      >
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
        <TabsContent
          value="saml"
          className="flex flex-1 overflow-hidden text-sm"
        >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={60}
              minSize={30}
              className="flex flex-1"
            >
              <Chat workflow={workflow} profile={profile} llms={llms} />
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className="w-2 rounded-lg bg-muted-foreground/5 transition-colors duration-500 data-[resize-handle-active]:bg-muted-foreground/50"
            />
            <ResizablePanel defaultSize={40}>
              <Saml workflow={workflow} profile={profile} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
      </Tabs>
    </div>
  )
}
