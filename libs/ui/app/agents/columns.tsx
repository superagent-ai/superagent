"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RxCheckCircled, RxCircle } from "react-icons/rx"

import { Badge } from "@/components/ui/badge"

export type Agent = {
  id: string
  name: string
  prompt: string
  isActive: boolean
}

export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row, column }) =>
      row.getValue(column.id) ? (
        <Badge variant="secondary">
          <div className="flex items-center">
            <RxCheckCircled className="mr-1 h-3 w-3 text-amber-400" />
            Deployed
          </div>
        </Badge>
      ) : (
        <Badge variant="secondary">
          <div className="text-muted-foreground flex items-center">
            <RxCircle className="mr-1 h-3 w-3" />
            Paused
          </div>
        </Badge>
      ),
  },
  {
    accessorKey: "prompt",
    header: "Prompt",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
]
