"use client"

import React from "react"
import { PlusIcon } from "lucide-react"

import { Profile } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Column } from "./Column"

interface Props {
  profile: Profile
}

export function DataTable({ profile }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <div>
        <Button
          size="sm"
          className="mb-5 flex items-center justify-center gap-3 rounded-sm p-3"
          onClick={() => {
            setOpen(true)
          }}
        >
          <>
            <PlusIcon />
            <span>Crear nuevo Q&A </span>
          </>
        </Button>
      </div>
      <div>
        <h2 className="mb-5 text-gray-500">Q&A</h2>
        <Column/>
      </div>
    </>
  )
}
