"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Smartphone,
  Landmark,
  WalletCards,
  Banknote,
} from "lucide-react"

import { useStore } from "@/lib/store"
import { discountedPrice } from "@/lib/types"
import { formatINR } from "@/lib/format"

type PaymentChoice =
  | "online"
  | "upi"
  | "netbanking"
  | "card"
  | "emi"

declare global {
  interface Window {
    Razorpay: new (options: any) => {
      open: () => void
    }
  }
}

export default function CheckoutPage() {
  const {
    products,
    cart,
    cartTotal,
    ready,
    addOrder,
    clearCart,
  } = useStore()

  const [loading, setLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentChoice>("online")

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

  function getRazorpayConfig(
    method: PaymentChoice
  ) {
    if (method === "online") {
      return undefined
    }

    const razorpayMethod =
      method === "upi"
        ? "upi"
        : method === "netbanking"
          ? "netbanking"
          : method === "card"
            ? "card"
            : "emi"

    const methodName =
      method === "upi"
        ? "UPI"
        : method === "netbanking"
          ? "Net Banking"
          : method === "card"
            ? "Debit / Credit Card"
            : "EMI"

    return {
      display: {
        blocks: {
          selected: {
            name: methodName,
            instruments: [
              {
                method: razorpayMethod,
              },
            ],
          },
        },
        sequence: ["block.selected"],
        preferences: {
          show_default_blocks: false,
        },
      },
    }
  }

  async function handlePayment() {
    if (
      !form.fullName.trim() ||
      !form.mobile.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      alert("Please fill all delivery details.")
      return
    }

    if (!selectedMethod) {
      alert("Please select a payment method.")
      return
    }

    try {
      setLoading(true)

      // 1. Create Razorpay order
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
          data?.error ||
            "Unable to create payment order"
        )
      }

      if (!data.keyId) {
        throw new Error(
          "Razorpay key is not configured"
        )
      }

      const openCheckout = () => {
        if (!window.Razorpay) {
          setLoading(false)
          alert("Razorpay could not be loaded.")
          return
        }

        const checkout =
          new window.Razorpay({
            key: data.keyId,
            amount: data.amount,
            currency: data.currency || "INR",

            name: "AURELIA",
            description: "Luxury Timepiece",
            order_id: data.orderId,

            config:
              getRazorpayConfig(
                selectedMethod
              ),

            prefill: {
              name: form.fullName,
              contact: form.mobile,
            },

            notes: {
              customer_name: form.fullName,
              mobile: form.mobile,
              address: form.address,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              payment_method:
                selectedMethod,
            },

            theme: {
              color: "#f2b84b",
            },

            handler: async function (
              payment: {
                razorpay_payment_id: string
                razorpay_order_id: string
                razorpay_signature: string
              }
            ) {
              try {
                // 2. Verify Razorpay payment
                const verifyResponse =
                  await fetch(
                    "/api/razorpay/verify",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type":
                          "application/json",
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

                // 3. Create order object
                const order = {
                  id: payment.razorpay_order_id,

                  createdAt: Date.now(),

                  items: items.map(
                    (item) => ({
                      productId: item.id,
                      name: item.name,
                      image: item.image,
                      price:
                        discountedPrice(item),
                      quantity:
                        item.quantity,
                    })
                  ),

                  amount: cartTotal,

                  address: {
                    fullName:
                      form.fullName,
                    mobile:
                      form.mobile,
                    address:
                      form.address,
                    city: form.city,
                    state: form.state,
                    pincode:
                      form.pincode,
                  },

                  paymentMethod:
                    selectedMethod,

                  paymentStatus:
                    "paid" as const,

                  orderStatus:
                    "Pending" as const,

                  razorpayOrderId:
                    payment.razorpay_order_id,

                  razorpayPaymentId:
                    payment.razorpay_payment_id,
                }

                // 4. Save order in Firebase
                const orderResponse =
                  await fetch("/api/orders", {
                    method: "POST",
                    headers: {
                      "Content-Type":
                        "application/json",
                    },
                    body: JSON.stringify(
                      order
                    ),
                  })

                const orderData =
                  await orderResponse.json()

                if (!orderResponse.ok) {
                  throw new Error(
                    orderData?.error ||
                      "Unable to save order"
                  )
                }

                // 5. Save locally also
                addOrder(order)

                // 6. Clear cart
                clearCart()

                // 7. Go to order history
                window.location.href =
                  "/history"
              } catch (error) {
                console.error(
                  "Payment/order error:",
                  error
                )

                alert(
                  error instanceof Error
                    ? error.message
                    : "Payment completed but order could not be saved."
                )

                setLoading(false)
              }
            },

            modal: {
              ondismiss: function () {
                setLoading(false)
              },
            },
          })

        checkout.open()
      }

      // Load Razorpay only once
      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )

      if (existingScript) {
        openCheckout()
        return
      }

      const script =
        document.createElement("script")

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js"

      script.async = true

      script.onload = openCheckout

      script.onerror = () => {
        setLoading(false)
        alert(
          "Unable to load Razorpay."
        )
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

  const paymentOptions = [
    {
      id: "upi" as const,
      title: "UPI",
      description:
        "Google Pay, PhonePe, Paytm & more",
      icon: Smartphone,
    },
    {
      id: "netbanking" as const,
      title: "Net Banking",
      description:
        "Pay through your bank",
      icon: Landmark,
    },
    {
      id: "card" as const,
      title: "Debit / Credit Card",
      description:
        "Visa, Mastercard & more",
      icon: CreditCard,
    },
    {
      id: "emi" as const,
      title: "EMI",
      description:
        "Available eligible EMI options",
      icon: Banknote,
    },
    {
      id: "online" as const,
      title: "Online Payment",
      description:
        "View all available Razorpay methods",
      icon: WalletCards,
    },
  ]

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
              updateField(
                "fullName",
                e.target.value
              )
            }
            placeholder="Full Name"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <input
            value={form.mobile}
            onChange={(e) =>
              updateField(
                "mobile",
                e.target.value
              )
            }
            placeholder="Mobile Number"
            inputMode="numeric"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <textarea
            value={form.address}
            onChange={(e) =>
              updateField(
                "address",
                e.target.value
              )
            }
            placeholder="Full Address"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.city}
              onChange={(e) =>
                updateField(
                  "city",
                  e.target.value
                )
              }
              placeholder="City"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />

            <input
              value={form.state}
              onChange={(e) =>
                updateField(
                  "state",
                  e.target.value
                )
              }
              placeholder="State"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <input
            value={form.pincode}
            onChange={(e) =>
              updateField(
                "pincode",
                e.target.value
              )
            }
            placeholder="PIN Code"
            inputMode="numeric"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-lg font-semibold">
          Select Payment Method
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Select your payment method, then tap Pay.
        </p>

        <div className="mt-4 space-y-3">
          {paymentOptions.map((option) => {
            const Icon = option.icon
            const selected =
              selectedMethod === option.id

            return (
              <button
                key={option.id}
                type="button"
                disabled={loading}
                onClick={() =>
                  setSelectedMethod(
                    option.id
                  )
                }
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {option.title}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>

                <div
                  className={`size-5 rounded-full border-2 ${
                    selected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {selected && (
                    <div className="m-1 size-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          <ShieldCheck className="size-5 shrink-0 text-primary" />

          <span>
            Secure payment powered by Razorpay.
            Your payment details are handled by Razorpay.
          </span>
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
            ? "Opening Razorpay..."
            : `Pay ${formatINR(cartTotal)}`}
        </button>
      </section>
    </main>
  )
}
