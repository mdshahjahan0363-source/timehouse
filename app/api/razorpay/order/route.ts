import { NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const amount = Number(body.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      )
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      console.error(
        "Razorpay keys are missing:",
        {
          keyId: Boolean(keyId),
          keySecret: Boolean(keySecret),
        }
      )

      return NextResponse.json(
        {
          error:
            "Razorpay server keys are not configured. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel Environment Variables.",
        },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    })
  } catch (error: any) {
    console.error(
      "Razorpay order error:",
      error
    )

    const errorMessage =
      error?.error?.description ||
      error?.error?.reason ||
      error?.message ||
      "Unable to create Razorpay order"

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
