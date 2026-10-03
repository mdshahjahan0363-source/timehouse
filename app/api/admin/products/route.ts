import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminDb } from "@/lib/firebase-admin"
import {
  ADMIN_COOKIE,
  isValidSessionToken,
} from "@/lib/admin-auth"
import { SEED_PRODUCTS } from "@/seed"

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  return isValidSessionToken(token)
}

// GET — सभी products
export async function GET() {
  try {
    let snapshot = await adminDb
      .collection("products")
      .get()

    if (snapshot.empty) {
      const batch = adminDb.batch()

      for (const product of SEED_PRODUCTS) {
        const ref = adminDb
          .collection("products")
          .doc(product.id)

        batch.set(ref, product)
      }

      await batch.commit()

      snapshot = await adminDb
        .collection("products")
        .get()
    }

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
export async function POST(
  request: NextRequest
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      )
    }

    const productData = JSON.parse(
      JSON.stringify(data)
    )

    if (!productData.name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    const docRef = adminDb
      .collection("products")
      .doc()

    await docRef.set({
      ...productData,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(
      {
        id: docRef.id,
        ...productData,
        createdAt: now,
        updatedAt: now,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST product error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create product",
      },
      { status: 500 }
    )
  }
}

// PUT — product update
export async function PUT(
  request: NextRequest
) {
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
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update product",
      },
      { status: 500 }
    )
  }
}

// DELETE — product delete
export async function DELETE(
  request: NextRequest
) {
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

    await adminDb
      .collection("products")
      .doc(id)
      .delete()

    return NextResponse.json({
      success: true,
      id,
    })
  } catch (error) {
    console.error("DELETE product error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete product",
      },
      { status: 500 }
    )
  }
}
