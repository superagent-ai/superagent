"use client"

import { useRouter } from "next/navigation"
import { Workflow } from "@/models/models"

import { Api } from "@/lib/api"
import { cn } from "@/lib/utils"
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
import { buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface DangerZoneProps {
  workflowData: any
  api_key: string
}
export default function DangerZone({ workflowData, api_key }: DangerZoneProps) {
  const workflow = new Workflow(workflowData)
  const { toast } = useToast()
  const router = useRouter()

  const api = new Api(api_key)
  const deleteWorkflow = async () => {
    try {
      await api.deleteWorkflow(workflow.id)
      toast({
        description: "Workflow deleted successfully",
      })
      router.refresh()
      router.push("/workflows")
    } catch (error: any) {
      toast({
        description: error?.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Danger Zone</h2>
      <div className="rounded-md border border-destructive/50 p-4">
        <div className="flex">
          <div>
            <strong>Delete workflow</strong>
            <div>
              Once you delete a workflow, there is no going back. Please be
              certain.
            </div>
          </div>

          <div className="ml-2 w-72">
            <AlertDialog>
              <AlertDialogTrigger
                className={cn(
                  buttonVariants({ variant: "destructive" }),
                  "mt-4"
                )}
              >
                Delete Workflow
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your workflow.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteWorkflow}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
