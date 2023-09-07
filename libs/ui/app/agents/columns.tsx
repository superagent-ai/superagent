"use client"

import { ColumnDef } from "@tanstack/react-table"

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
    cell: ({ row, column }) => (
      <Badge variant="secondary">
        {row.getValue(column.id) ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "llmModel",
    header: "Model",
    cell: ({ row, column }) => (
      <Badge variant="secondary">{row.getValue(column.id)}</Badge>
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
