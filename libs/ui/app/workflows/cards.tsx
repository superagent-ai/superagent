"use client"

import Link from "next/link"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { TbBolt, TbStack2 } from "react-icons/tb"

import { Badge } from "@/components/ui/badge"

export default function WorkflowCards({
  workflows,
}: {
  workflows: Array<any>
}) {
  return (
    <ScrollArea className="flex grow overflow-auto border-t px-6 pt-12">
      <div className="container">
        <div className="grid grid-cols-4 gap-4">
          {workflows.map((workflow) => (
            <Link key={workflow.id} passHref href={`/workflows/${workflow.id}`}>
              <div className="col-span-1 flex cursor-pointer flex-col space-y-5 rounded-lg border bg-muted px-6 py-4 hover:bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <TbStack2 fontSize="20px" />
                    <p className="font-semibold">{workflow.name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    className="space-x-1 self-start bg-background"
                    variant="outline"
                  >
                    <TbBolt size={15} />
                    <span>{workflow.steps.length}</span>
                  </Badge>
                  <p className="font-mono text-xs text-muted-foreground">
                    {new Date(workflow.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
