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

    // Firebase में कोई product नहीं है तो seed products डालें
    if (snapshot.empty) {
      const batch = adminDb.batch()

      for (const product of SEED_PRODUCTS) {
        const ref = adminDb
          .collection("products")
          .doc(product.id)

        batch.set(ref, {
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
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

    return NextResponse.json({
      products,
    })
  } catch (error) {
    console.error("GET products error:", error)

    return NextResponse.json(
      {
        error: "Failed to load products",
      },
      {
        status: 500,
      }
    )
  }
}

// POST — नया product
export async function POST(
  request: NextRequest
) {
  try {
    const isAdmin = await requireAdmin()

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const data = await request.json()

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        {
          error: "Invalid product data",
        },
        {
          status: 400,
        }
      )
    }

    const now = new Date().toISOString()

    const productData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await adminDb
      .collection("products")
      .add(productData)

    const savedProduct = {
      id: docRef.id,
      ...productData,
    }

    console.log(
      "PRODUCT SAVED:",
      savedProduct
    )

    return NextResponse.json(
      savedProduct,
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "POST product error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create product",
      },
      {
        status: 500,
      }
    )
  }
}

// PUT — product update
export async function PUT(
  request: NextRequest
) {
  try {
    const isAdmin = await requireAdmin()

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const data = await request.json()
    const { id, ...updates } = data

    if (!id) {
      return NextResponse.json(
        {
          error: "Product id is required",
        },
        {
          status: 400,
        }
      )
    }

    const productRef = adminDb
      .collection("products")
      .doc(id)

    const existing =
      await productRef.get()

    if (!existing.exists) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      )
    }

    await productRef.update({
      ...updates,
      updatedAt:
        new Date().toISOString(),
    })

    return NextResponse.json({
      id,
      ...updates,
    })
  } catch (error) {
    console.error(
      "PUT product error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update product",
      },
      {
        status: 500,
      }
    )
  }
}

// DELETE — product delete
export async function DELETE(
  request: NextRequest
) {
  try {
    const isAdmin = await requireAdmin()

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const { id } =
      await request.json()

    if (!id) {
      return NextResponse.json(
        {
          error: "Product id is required",
        },
        {
          status: 400,
        }
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
    console.error(
      "DELETE product error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete product",
      },
      {
        status: 500,
      }
    )
  }
}
