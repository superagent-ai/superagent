"use client"

import { useRouter } from "next/navigation"
import { RxActivityLog, RxGear, RxPlay } from "react-icons/rx"
import { TbTrash } from "react-icons/tb"

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Overview from "./overview"

interface Agent {
  agent: any
  profile: {
    api_key: string
    id: string
  }
}

export default function Agent({ agent, profile }: Agent) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  return agent ? (
    <div className="flex flex-1 flex-col space-y-5 p-6">
      <div className="flex space-x-2 text-sm text-muted-foreground">
        <span>Assistants</span>
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
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="outline" size="sm" className="space-x-2">
              <TbTrash size={20} />
              <span>Delete</span>
            </Button>
          </AlertDialogTrigger>
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
                  router.push("/agents")
                }}
              >
                Yes, delete!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" className="space-x-1">
            <RxGear size={12} />
            <span>OVERVIEW</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="space-x-1">
            <RxActivityLog size={12} />
            <span>LOGS</span>
          </TabsTrigger>
          <TabsTrigger value="run" className="space-x-1">
            <RxPlay size={12} />
            <span>RUN</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="py-2 text-sm">
          <Overview agent={agent} profile={profile} />
        </TabsContent>
        <TabsContent value="logs" className="py-2 text-sm">
          Logs
        </TabsContent>
        <TabsContent value="runs" className="py-2 text-sm">
          Runs
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
