import { NextRequest, NextResponse } from "next/server"

const MAIN_DOMAIN = "timehub1.vercel.app"

export function middleware(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    ""

  // Main website ko redirect nahi karna
  if (
    host === MAIN_DOMAIN ||
    host.startsWith(`${MAIN_DOMAIN}:`)
  ) {
    return NextResponse.next()
  }

  // Local development ko redirect nahi karna
  if (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1")
  ) {
    return NextResponse.next()
  }

  // Preview/deployment domain ko main domain par bhejo
  const url = request.nextUrl.clone()
  url.protocol = "https:"
  url.host = MAIN_DOMAIN

  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: [
    "/((?!api/|_next/|favicon.ico).*)",
  ],
}
