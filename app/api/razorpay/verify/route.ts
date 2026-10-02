import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      )
    }

    const secret = process.env.RAZORPAY_KEY_SECRET

    if (!secret) {
      return NextResponse.json(
        { error: "Razorpay secret is not configured" },
        { status: 500 }
      )
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    })
  } catch (error) {
    console.error("Razorpay verification error:", error)

    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    )
  }
}
