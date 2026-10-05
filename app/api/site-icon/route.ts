import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const doc = await adminDb
      .collection("settings")
      .doc("site")
      .get()

    const logoUrl = doc.data()?.logoUrl || ""

    if (!logoUrl) {
      return new NextResponse(null, {
        status: 404,
      })
    }

    const match = logoUrl.match(
      /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/,
    )

    if (!match) {
      return new NextResponse(null, {
        status: 404,
      })
    }

    const imageType = match[1]
    const base64Data = match[2]

    const imageBuffer = Buffer.from(
      base64Data,
      "base64",
    )

    const contentType =
      imageType === "svg+xml"
        ? "image/svg+xml"
        : `image/${imageType}`

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error(
      "Site icon error:",
      error,
    )

    return new NextResponse(null, {
      status: 500,
    })
  }
}
