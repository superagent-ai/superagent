import * as React from "react"

import { Card, CardContent } from "./ui/card"

interface NonIdealState {
  title: string
  description: string
  icon: React.ComponentType<{ size?: number }>
}

export default function NonIdealState({
  title,
  icon: Icon,
  description,
}: NonIdealState) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20">
      <Icon size={30} />
      <div className="flex flex-col items-center justify-center space-y-0">
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
