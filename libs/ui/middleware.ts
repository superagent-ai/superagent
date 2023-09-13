import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and the current path is / redirect the user to /agents
  if (user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/agents", req.url))
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (profile && !profile.is_onboarded) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/agents/:path*",
    "/settings/:path*",
    "/apis/:path*",
    "/datasources/:path*",
    "/workflows/:path*",
    "/llms/:path*",
  ],
}
