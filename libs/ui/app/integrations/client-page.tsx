"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function IntegrationsClientPage() {
  return (
    <Tabs defaultValue="overview" className="flex-1 space-y-0 overflow-hidden">
      <TabsList className="px-6 py-1.5">
        <TabsTrigger value="overview" className="space-x-1">
          <span>OVERVIEW</span>
        </TabsTrigger>
        <TabsTrigger value="logs" className="space-x-1">
          <span>LOGS</span>
        </TabsTrigger>
        <TabsTrigger value="chat" className="space-x-1">
          <span>RUN</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="px-6 py-2 text-sm"></TabsContent>
      <TabsContent value="logs" className="h-full text-sm"></TabsContent>
      <TabsContent value="chat" className="h-full text-sm"></TabsContent>
    </Tabs>
  )
}
