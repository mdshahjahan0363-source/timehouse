
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminDb } from "@/lib/firebase-admin"
import {
  ADMIN_COOKIE,
  isValidSessionToken,
} from "@/lib/admin-auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE)?.value

    if (!(await isValidSessionToken(token))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const snapshot = await adminDb
      .collection("customers")
      .get()

    const users = snapshot.docs.map((doc) => {
      const data = doc.data()

      return {
        id: doc.id,
        name: String(data.name || ""),
        mobile: String(data.mobile || doc.id),
        dateTime: Number(data.createdAt || data.updatedAt || 0),
      }
    }).sort((a, b) => b.dateTime - a.dateTime)

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Load customers error:", error)

    return NextResponse.json(
      { error: "Failed to load customers" },
      { status: 500 }
    )
  }
}
