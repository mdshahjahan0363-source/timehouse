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

  if (!isValidSessionToken(token)) {
    return false
  }

  return true
}

// GET — admin products
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    )
  }

  const snapshot = await adminDb
    .collection("products")
    .get()

  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  return NextResponse.json(products)
}

// POST — add product
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    )
  }

  try {
    const body = await request.json()

    const id =
      body.id ||
      `p_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 7)}`

    const product = {
      ...body,
      id: undefined,
    }

    delete product.id

    await adminDb
      .collection("products")
      .doc(id)
      .set(product)

    return NextResponse.json({
      success: true,
      product: {
        id,
        ...product,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 },
    )
  }
}

// PUT — update product
export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    )
  }

  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 },
      )
    }

    const { id, ...product } = body

    await adminDb
      .collection("products")
      .doc(id)
      .set(product, { merge: true })

    return NextResponse.json({
      success: true,
      product: {
        id,
        ...product,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    )
  }
}

// DELETE — delete product
export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    )
  }

  try {
    const id = request.nextUrl.searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 },
      )
    }

    await adminDb
      .collection("products")
      .doc(id)
      .delete()

    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    )
  }
}
