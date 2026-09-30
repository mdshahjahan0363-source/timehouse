import { NextRequest, NextResponse } from "next/server"
import {
  ADMIN_COOKIE,
  getAdminPassword,
  makeSessionToken,
} from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || password !== getAdminPassword()) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    const token = makeSessionToken()

    const response = NextResponse.json({ success: true })

    response.cookies.set({
      name: ADMIN_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}
