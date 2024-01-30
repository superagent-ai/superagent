import React from "react"

import { BookIcon } from "@/components/svg/BookIcon"

interface Props {
  description: string
  id: string
}

export const ItemFA = ({ description, id }: Props) => {
  return (
    <div className="hover:bg-white-100 flex items-center justify-between  gap-2 rounded-md pl-2 md:w-[600px]">
      <div className="flex items-center gap-2">
        <BookIcon />
        <h2>{description}</h2>
      </div>
      <button className="rounded-md bg-red-500 p-2 transition-colors hover:bg-red-400">Delete</button>
    </div>
  )
}
