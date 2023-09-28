import { randomUUID } from "crypto"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Apideck from "@apideck/node"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await request.json()
  const { userId, fileId, mimeType, fileName } = body
  const apideck = new Apideck({
    apiKey: process.env.NEXT_PUBLIC_APIDECK_API_KEY as string,
    appId: process.env.NEXT_PUBLIC_APIDECK_API_ID as string,
    consumerId: userId,
  })
  const data = await apideck.fileStorage.filesDownload({
    id: fileId,
  })
  const path = `public/${randomUUID()}`
  const storageName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME
  if (!storageName)
    throw new Error("Storage name is not defined in environment variables.")

  const { error } = await supabase.storage
    .from(storageName)
    .upload(path, data, { contentType: mimeType })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from(storageName).getPublicUrl(path)

  return NextResponse.json({ publicUrl })
}
