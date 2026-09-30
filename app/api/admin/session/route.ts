import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  ADMIN_COOKIE,
  isValidSessionToken,
} from "@/lib/admin-auth"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  if (!isValidSessionToken(token)) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }

  return NextResponse.json({
    authenticated: true,
  })
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
  })

  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
