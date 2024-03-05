import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (
      profile &&
      !profile.is_onboarded &&
      req.nextUrl.pathname !== "/onboarding"
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }

    if (profile.is_onboarded && req.nextUrl.pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/workflows", req.url))
    }

    if (user && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/workflows", req.url))
    }
  }

  if (!user && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/logs/:path*",
    "/settings/:path*",
    "/integrations/:path*",
    "/workflows/:path*",
    "/onboarding",
  ],
}
