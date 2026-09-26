import { type NextRequest, NextResponse } from "next/server"
import {
  ADMIN_COOKIE,
  getAdminPassword,
  makeSessionToken,
} from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!body.password || body.password !== getAdminPassword()) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  })
  return res
}
