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
        <div className="text-right">
          <Badge variant="secondary">
            <div className="flex items-center space-x-1">
              <RxCheckCircled className="mr-1 h-3 w-3 text-green-400" />
              <span className="font-mono font-normal text-muted-foreground">
                DEPLOYED
              </span>
            </div>
          </Badge>
        </div>
      ) : (
        <div className="text-right">
          <Badge variant="secondary">
            <div className="flex items-center text-muted-foreground">
              <RxCircle className="mr-1 h-3 w-3" />
              Paused
            </div>
          </Badge>
        </div>
      ),
  },
]
