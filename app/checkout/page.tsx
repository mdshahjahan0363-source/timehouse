"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react"

import { useStore } from "@/lib/store"
import { discountedPrice } from "@/lib/types"
import { formatINR } from "@/lib/format"

export default function CheckoutPage() {
  const { products, cart, cartTotal, ready } = useStore()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading checkout...
        </p>
      </main>
    )
  }

  const items = cart
    .map((item) => {
      const product = products.find(
        (product) => product.id === item.productId
      )

      if (!product) return null

      return {
        ...product,
        quantity: item.quantity,
        total:
          discountedPrice(product) * item.quantity,
      }
    })
    .filter(Boolean) as Array<
    (typeof products)[number] & {
      quantity: number
      total: number
    }
  >

  if (items.length === 0) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="text-2xl font-semibold">
          Your cart is empty
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Add a watch to your cart before checkout.
        </p>

        <Link
          href="/"
          className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Back to Store
        </Link>
      </main>
    )
  }

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handlePayment() {
    if (
      !form.fullName ||
      !form.mobile ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all delivery details.")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        "/api/razorpay/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: cartTotal,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create payment order"
        )
      }

      const script = document.createElement("script")
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js"

      script.onload = () => {
        const Razorpay = (
          window as unknown as {
            Razorpay: new (options: unknown) => {
              open: () => void
            }
          }
        ).Razorpay

        const checkout = new Razorpay({
          key:
            process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency || "INR",
          name: "AURELIA",
          description: "Luxury Timepiece",
          order_id: data.orderId,

          handler: async function (
            payment: {
              razorpay_payment_id: string
              razorpay_order_id: string
              razorpay_signature: string
            }
          ) {
            try {
              const verifyResponse = await fetch(
                "/api/razorpay/verify",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    razorpay_payment_id:
                      payment.razorpay_payment_id,
                    razorpay_order_id:
                      payment.razorpay_order_id,
                    razorpay_signature:
                      payment.razorpay_signature,
                  }),
                }
              )

              const verifyData =
                await verifyResponse.json()

              if (!verifyResponse.ok) {
                throw new Error(
                  verifyData?.error ||
                    "Payment verification failed"
                )
              }

              window.location.href =
                "/?payment=success"
            } catch (error) {
              console.error(error)
              alert(
                "Payment verification failed. Please contact support."
              )
            } finally {
              setLoading(false)
            }
          },

          prefill: {
            name: form.fullName,
            contact: form.mobile,
          },

          theme: {
            color: "#f2b84b",
          },

          modal: {
            ondismiss: function () {
              setLoading(false)
            },
          },
        })

        checkout.open()
      }

      script.onerror = () => {
        setLoading(false)
        alert("Unable to load Razorpay.")
      }

      document.body.appendChild(script)
    } catch (error) {
      console.error(error)
      setLoading(false)
      alert(
        error instanceof Error
          ? error.message
          : "Payment could not be started."
      )
    }
  }

  return (
    <main className="min-h-dvh bg-background pb-8">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-full border border-border"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <p className="text-xs text-muted-foreground">
              AURELIA
            </p>

            <h1 className="text-lg font-semibold">
              Checkout
            </h1>
          </div>
        </div>
      </header>

      <section className="px-4 pt-5">
        <h2 className="text-lg font-semibold">
          Order Summary
        </h2>

        <div className="mt-3 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-secondary/20">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {formatINR(item.total)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-border p-4">
          <span className="text-sm text-muted-foreground">
            Total Amount
          </span>

          <span className="text-xl font-semibold">
            {formatINR(cartTotal)}
          </span>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-lg font-semibold">
          Delivery Details
        </h2>

        <div className="mt-4 space-y-3">
          <input
            value={form.fullName}
            onChange={(e) =>
              updateField("fullName", e.target.value)
            }
            placeholder="Full Name"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <input
            value={form.mobile}
            onChange={(e) =>
              updateField("mobile", e.target.value)
            }
            placeholder="Mobile Number"
            inputMode="numeric"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <textarea
            value={form.address}
            onChange={(e) =>
              updateField("address", e.target.value)
            }
            placeholder="Full Address"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.city}
              onChange={(e) =>
                updateField("city", e.target.value)
              }
              placeholder="City"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />

            <input
              value={form.state}
              onChange={(e) =>
                updateField("state", e.target.value)
              }
              placeholder="State"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <input
            value={form.pincode}
            onChange={(e) =>
              updateField("pincode", e.target.value)
            }
            placeholder="PIN Code"
            inputMode="numeric"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="size-5 text-primary" />

            <div>
              <p className="text-sm font-semibold">
                Online Payment
              </p>

              <p className="text-xs text-muted-foreground">
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4" />
            Secure checkout
          </div>
        </div>
      </section>

      <section className="sticky bottom-0 z-30 mt-8 border-t border-border bg-background/95 p-4 backdrop-blur">
        <button
          type="button"
          onClick={handlePayment}
          disabled={loading}
          className="w-full rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Opening Payment..."
            : `Pay ${formatINR(cartTotal)}`}
        </button>
      </section>
    </main>
  )
}
