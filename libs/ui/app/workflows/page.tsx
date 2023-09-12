"use client"

import Image from "next/image"

import { Badge } from "@/components/ui/badge"

export default async function Workflows() {
  return (
    <div className="flex min-h-full flex-col space-y-4 px-4 py-6">
      <div className="flex space-x-4">
        <p className="text-lg">Workflows</p>
        <Badge>Coming soon</Badge>
      </div>
      <div className="flex flex-col flex-1 items-center justify-center">
        <Image
          src="/workflow.png"
          alt="Superagent Agent Worflows"
          width={600}
          height={4000}
        />
      </div>
    </div>
  )
}
