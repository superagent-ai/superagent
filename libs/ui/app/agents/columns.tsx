"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RxCheckCircled, RxCircle } from "react-icons/rx"

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
        <div className="flex items-center">
          <RxCheckCircled className="mr-1 h-3 w-3 text-amber-400" />
          Enabled
        </div>
      ) : (
        <div className="text-muted-foreground flex items-center">
          <RxCircle className="mr-1 h-3 w-3" />
          Disabled
        </div>
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
