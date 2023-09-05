import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const supabase = createRouteHandlerClient({ cookies })

  await supabase.auth.signInWithPassword({
    email: email as string,
    password: password as string,
  })

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  })
}