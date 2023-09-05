import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")
  const supabase = createRouteHandlerClient({ cookies })

  await supabase.auth.signUp({
    email: email as string,
    password: password as string,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },
  })

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  })
}
