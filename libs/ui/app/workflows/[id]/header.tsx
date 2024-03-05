import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Workflow } from "@/models/models"
import { TbCode, TbTrash } from "react-icons/tb"

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
import { useEditableField } from "@/components/hooks/"

interface HeaderProps {
  profile: Profile
  workflow: Workflow
}

const Header = ({ profile, workflow }: HeaderProps) => {
  const router = useRouter()
  const api = new Api(profile.api_key)
  const [open, setOpen] = useState<boolean>(false)

  const updateName = async (name: string) => {
    await api.patchWorkflow(workflow.id, {
      ...workflow,
      name,
    })
    router.refresh()
  }

  return (
    <>
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
          {useEditableField(workflow.name, updateName)}

          <span className="font-mono text-xs font-normal text-muted-foreground">
            <span>
              CREATED AT:{" "}
              <span className="text-foreground">
                {workflow.createdAt.toString()}
              </span>
            </span>
          </span>
        </div>
        <div className="flex space-x-2">
          <Link
            passHref
            target="_blank"
            href="https://docs.superagent.sh/api-reference/api-reference/workflow/invoke"
          >
            <Button className="space-x-2" size="sm" variant="outline">
              <TbCode size={20} />
              <span>API</span>
            </Button>
          </Link>
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
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
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
      </div>
    </>
  )
}

export default Header
