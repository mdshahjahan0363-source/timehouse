
import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = String(body.name || "").trim()
    const mobile = String(body.mobile || "")
      .replace(/\D/g, "")
      .slice(-10)

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: "Please enter a valid name" },
        { status: 400 }
      )
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Please enter a valid mobile number" },
        { status: 400 }
      )
    }

    const customer = {
      name,
      mobile,
      updatedAt: Date.now(),
      source: "website",
    }

    await adminDb
      .collection("customers")
      .doc(mobile)
      .set(customer, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Save customer error:", error)

    return NextResponse.json(
      { error: "Unable to save customer details" },
      { status: 500 }
    )
  }
}
