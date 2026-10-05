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

// Get current site settings
export async function GET() {
  try {
    const doc = await adminDb
      .collection("settings")
      .doc("site")
      .get()

    if (!doc.exists) {
      return NextResponse.json({
        siteName: "TIMEHUB",
        tagline: "Luxury Timepieces",
        logoUrl: "",
      })
    }

    return NextResponse.json({
      siteName: doc.data()?.siteName || "TIMEHUB",
      tagline:
        doc.data()?.tagline || "Luxury Timepieces",
      logoUrl: doc.data()?.logoUrl || "",
    })
  } catch (error) {
    console.error("GET settings error:", error)

    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 },
    )
  }
}

// Save site settings
export async function PUT(
  request: NextRequest,
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const data = await request.json()

    const siteName =
      typeof data.siteName === "string"
        ? data.siteName.trim()
        : "TIMEHUB"

    const tagline =
      typeof data.tagline === "string"
        ? data.tagline.trim()
        : "Luxury Timepieces"

    const logoUrl =
      typeof data.logoUrl === "string"
        ? data.logoUrl
        : ""

    // Firestore document limit से बचने के लिए
    // logo को छोटा रखा गया है.
    if (logoUrl.length > 700000) {
      return NextResponse.json(
        {
          error:
            "Logo file is too large. Please use a smaller logo.",
        },
        { status: 400 },
      )
    }

    await adminDb
      .collection("settings")
      .doc("site")
      .set(
        {
          siteName,
          tagline,
          logoUrl,
          updatedAt: Date.now(),
        },
        { merge: true },
      )

    return NextResponse.json({
      success: true,
      siteName,
      tagline,
      logoUrl,
    })
  } catch (error) {
    console.error("PUT settings error:", error)

    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    )
  }
}
