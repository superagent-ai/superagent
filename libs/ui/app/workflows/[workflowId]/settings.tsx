"use client"

import { RxGear } from "react-icons/rx"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import DangerZone from "./danger-zone"
import Update from "./update"

export default function WorkflowSettingsModal({
  workflowId,
  workflowData,
  api_key,
}: {
  workflowId: string
  workflowData: any
  api_key: string
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <RxGear />
      </DialogTrigger>
      <DialogContent>
        <Update api_key={api_key} workflowData={workflowData} />
        <DangerZone api_key={api_key} workflowData={workflowData} />
      </DialogContent>
    </Dialog>
  )
}
