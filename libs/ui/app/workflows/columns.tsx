"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RxCheckCircled, RxCircle } from "react-icons/rx"

import { Badge } from "@/components/ui/badge"

export type Agent = {
  id: string
  name: string
  description: string
}

export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
]
