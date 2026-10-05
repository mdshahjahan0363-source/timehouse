import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminDb } from "@/lib/firebase-admin"
import {
  ADMIN_COOKIE,
  isValidSessionToken,
} from "@/lib/admin-auth"

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  return isValidSessionToken(token)
}

export async function GET() {
  try {
    const doc = await adminDb
      .collection("settings")
      .doc("site")
      .get()

    if (!doc.exists) {
      return NextResponse.json({
        logo: "/icon-512.png",
      })
    }

    return NextResponse.json({
      logo: doc.data()?.logo || "/icon-512.png",
    })
  } catch (error) {
    console.error("GET settings error:", error)

    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()

    if (!data.logo) {
      return NextResponse.json(
        { error: "Logo is required" },
        { status: 400 }
      )
    }

    await adminDb
      .collection("settings")
      .doc("site")
      .set(
        {
          logo: data.logo,
          updatedAt: Date.now(),
        },
        { merge: true }
      )

    return NextResponse.json({
      success: true,
      logo: data.logo,
    })
  } catch (error) {
    console.error("PUT settings error:", error)

    return NextResponse.json(
      { error: "Failed to update logo" },
      { status: 500 }
    )
  }
}
