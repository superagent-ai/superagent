"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import LLM from "./llm"
import Storage from "./storage"

export default function IntegrationsClientPage({
  profile,
  configuredDBs,
  configuredLLMs,
}: {
  profile: any
  configuredDBs: any
  configuredLLMs: any
}) {
  return (
    <Tabs defaultValue="storage" className="flex-1 space-y-0 overflow-hidden">
      <TabsList className="px-6 py-1.5">
        <TabsTrigger value="storage" className="space-x-1">
          <span>STORAGE</span>
        </TabsTrigger>
        <TabsTrigger value="llm" className="space-x-1">
          <span>LANGUAGE MODELS</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="storage" className="px-6 py-2 text-sm">
        <Storage profile={profile} configuredDBs={configuredDBs} />
      </TabsContent>
      <TabsContent value="llm" className="h-full text-sm">
        <LLM profile={profile} configuredLLMs={configuredLLMs} />
      </TabsContent>
      <TabsContent value="datasources" className="h-full text-sm"></TabsContent>
      <TabsContent value="tools" className="h-full text-sm"></TabsContent>
    </Tabs>
  )
}
