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
    let snapshot = await adminDb
      .collection("support")
      .orderBy("createdAt", "asc")
      .get()

    if (snapshot.empty) {
      const defaults = [
        {
          title: "WhatsApp",
          description: "Chat with us on WhatsApp",
          type: "whatsapp",
          link: "https://wa.me/919241331531",
          enabled: true,
        },
        {
          title: "Email",
          description: "Send us an email",
          type: "email",
          link: "mailto:support@timehub.com",
          enabled: true,
        },
        {
          title: "Contact",
          description: "Call our customer support",
          type: "phone",
          link: "tel:+919241331531",
          enabled: true,
        },
        {
          title: "Instagram",
          description: "Follow us on Instagram",
          type: "instagram",
          link: "#",
          enabled: true,
        },
        {
          title: "Facebook",
          description: "Follow us on Facebook",
          type: "facebook",
          link: "#",
          enabled: true,
        },
      ]

      const batch = adminDb.batch()

      defaults.forEach((item, index) => {
        const ref = adminDb
          .collection("support")
          .doc()

        batch.set(ref, {
          ...item,
          createdAt: index,
        })
      })

      await batch.commit()

      snapshot = await adminDb
        .collection("support")
        .orderBy("createdAt", "asc")
        .get()
    }

    const support = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ support })
  } catch (error) {
    console.error("GET support error:", error)

    return NextResponse.json(
      { error: "Failed to load support options" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const data = await request.json()

    if (!data.title || !data.link) {
      return NextResponse.json(
        { error: "Title and link are required" },
        { status: 400 },
      )
    }

    const ref = await adminDb
      .collection("support")
      .add({
        title: data.title,
        description: data.description || "",
        type: data.type || "contact",
        link: data.link,
        enabled: data.enabled !== false,
        createdAt: Date.now(),
      })

    return NextResponse.json({
      id: ref.id,
      ...data,
    })
  } catch (error) {
    console.error("POST support error:", error)

    return NextResponse.json(
      { error: "Failed to add support option" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const data = await request.json()
    const { id, ...updates } = data

    if (!id) {
      return NextResponse.json(
        { error: "Support id is required" },
        { status: 400 },
      )
    }

    await adminDb
      .collection("support")
      .doc(id)
      .update({
        title: updates.title,
        description: updates.description || "",
        type: updates.type || "contact",
        link: updates.link,
        enabled: updates.enabled !== false,
        updatedAt: Date.now(),
      })

    return NextResponse.json({
      success: true,
      id,
    })
  } catch (error) {
    console.error("PUT support error:", error)

    return NextResponse.json(
      { error: "Failed to update support option" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Support id is required" },
        { status: 400 },
      )
    }

    await adminDb
      .collection("support")
      .doc(id)
      .delete()

    return NextResponse.json({
      success: true,
      id,
    })
  } catch (error) {
    console.error("DELETE support error:", error)

    return NextResponse.json(
      { error: "Failed to delete support option" },
      { status: 500 },
    )
  }
}
