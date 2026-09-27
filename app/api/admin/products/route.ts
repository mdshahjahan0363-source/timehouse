import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminDb } from "@/lib/firebase-admin"
import {
  ADMIN_COOKIE,
  isValidSessionToken,
} from "@/admin-auth"

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  return isValidSessionToken(token)
}

// GET — सभी products
export async function GET() {
  try {
    const snapshot = await adminDb.collection("products").get()

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error("GET products error:", error)
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    )
  }
}

// POST — नया product
export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()

    const docRef = await adminDb.collection("products").add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      id: docRef.id,
      ...data,
    })
  } catch (error) {
    console.error("POST product error:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

// PUT — product update
export async function PUT(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { id, ...updates } = data

    if (!id) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 }
      )
    }

    await adminDb
      .collection("products")
      .doc(id)
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })

    return NextResponse.json({
      id,
      ...updates,
    })
  } catch (error) {
    console.error("PUT product error:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// DELETE — product delete
export async function DELETE(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 }
      )
    }

    await adminDb.collection("products").doc(id).delete()

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("DELETE product error:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
