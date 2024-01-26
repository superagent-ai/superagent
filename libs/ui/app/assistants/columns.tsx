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
    cell: ({ row, column }) => (
      <p className="overflow-ellipsis">{row.getValue(column.id)}</p>
    ),
  },
]
