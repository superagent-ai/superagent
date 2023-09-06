"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "prompt",
    header: "Prompt",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const agent = row.original

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(agent.id)}
              >
                Copy agent ID
              </DropdownMenuItem>
              <DropdownMenuItem>View agent</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => console.log("selected")}>
                Delete agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
