"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { RxActivityLog, RxPieChart, RxPlay } from "react-icons/rx"

import { initialSamlValue } from "@/config/saml"
import { Api } from "@/lib/api"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Chat from "./chat"
import Header from "./header"
import LLMDialog from "./llm-dialog"

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
  const router = useRouter()
  const [isLLMModalOpen, setIsLLMModalOpen] = React.useState<boolean>(
    llms.length === 0
  )

  const handleLLMSave = React.useCallback(async () => {
    const api = new Api(profile.api_key)
    await api.generateWorkflow(workflow.id, initialSamlValue)
    router.refresh()
  }, [workflow, profile, router])

  return (
    <div className="flex max-h-screen flex-1 flex-col space-y-5 pt-6">
      <LLMDialog
        isOpen={isLLMModalOpen}
        onOpenChange={(change: any) => setIsLLMModalOpen(change)}
        profile={profile}
        workflow={workflow}
        onSave={handleLLMSave}
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
        <TabsContent value="stats" className="h-full px-6 py-2 text-sm">
          {/* <Overview profile={profile} data={logs || []} /> */}
          <div className="flex h-full items-center justify-center ">
            <div className="container flex max-w-lg flex-col space-y-6 rounded-lg border p-6">
              <RxPieChart size={20} />
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-semibold">Coming soon</p>
                <p className="text-sm text-muted-foreground">
                  We will be rolling out detailed logs for your workflows soon!
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="logs" className="h-full text-sm">
          <div className="flex h-full items-center justify-center ">
            <div className="container flex max-w-lg flex-col space-y-6 rounded-lg border p-6">
              <RxActivityLog size={20} />
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-semibold">Coming soon</p>
                <p className="text-sm text-muted-foreground">
                  We will be rolling out detailed logs for your workflows soon!
                </p>
              </div>
            </div>
          </div>
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
