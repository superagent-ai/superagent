"use client"

import Link from "next/link"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { TbStack2 } from "react-icons/tb"

interface Workflow {
  id: string
  createdAt: string
  name: string
  description: string
}

export default function WorkflowCards({
  workflows,
}: {
  workflows: Array<Workflow>
}) {
  return (
    <ScrollArea className="flex grow overflow-auto border-t px-6 py-4">
      <div className="container">
        <div className="grid grid-cols-4 gap-4">
          {workflows.map((workflow) => (
            <Link passHref href={`/workflows/${workflow.id}`}>
              <div
                key={workflow.id}
                className="col-span-1 flex cursor-pointer flex-col space-y-3 rounded-lg border bg-muted p-6 hover:bg-background"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <TbStack2 fontSize="20px" />
                    <p className="font-semibold">{workflow.name}</p>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {new Date(workflow.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-sm">{workflow.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
