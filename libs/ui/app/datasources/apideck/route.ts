import { NextRequest, NextResponse } from "next/server"
import Apideck from "@apideck/node"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId } = body
  const apideck = new Apideck({
    apiKey: process.env.NEXT_PUBLIC_APIDECK_API_KEY || "",
    appId: process.env.NEXT_PUBLIC_APIDECK_API_ID || "",
    consumerId: userId,
  })
  const settings = {}
  const result = await apideck.vault.sessionsCreate(settings)
  return NextResponse.json(result)
}
