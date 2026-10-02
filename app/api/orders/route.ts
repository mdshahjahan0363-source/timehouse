import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const order = await request.json()

    if (!order.id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    const data = {
      ...order,
      createdAt:
        typeof order.createdAt === "number"
          ? order.createdAt
          : Date.now(),
    }

    await adminDb
      .collection("orders")
      .doc(String(order.id))
      .set(data)

    return NextResponse.json({
      success: true,
      order: data,
    })
  } catch (error) {
    console.error("Create order error:", error)

    return NextResponse.json(
      { error: "Unable to save order" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mobile = searchParams.get("mobile")

    const snapshot = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get()

    let orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    if (mobile) {
      orders = orders.filter(
        (order: any) =>
          order.address?.mobile === mobile
      )
    }

    return NextResponse.json({
      orders,
    })
  } catch (error) {
    console.error("Get orders error:", error)

    return NextResponse.json(
      { error: "Unable to load orders" },
      { status: 500 }
    )
  }
}
