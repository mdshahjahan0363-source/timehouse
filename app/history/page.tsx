"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import { useStore } from "@/lib/store"
import { formatINR, formatDate } from "@/lib/format"

export default function HistoryPage() {
  const { orders, ready } = useStore()

  if (!ready) {
    return (
      <main className="min-h-dvh bg-[#0b0a08] text-white">
        <div className="flex min-h-dvh items-center justify-center text-white/50">
          Loading orders...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-[#0b0a08] pb-10 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0a08]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-4">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-full border border-white/15"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <h1 className="text-lg font-semibold">
              Order History
            </h1>

            <p className="text-[11px] text-white/40">
              Your previous orders
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-md px-4 py-5">
        {orders.length === 0 ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-[#151310]">
              <Package className="size-7 text-white/40" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              No orders yet
            </h2>

            <p className="mt-2 max-w-xs text-sm text-white/40">
              Your completed orders will appear here.
            </p>

            <Link
              href="/"
              className="mt-6 rounded-full bg-[#f2b84b] px-5 py-3 text-sm font-semibold text-black"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders
              .slice()
              .reverse()
              .map((order) => (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#151310]"
                >
                  {/* ORDER HEADER */}
                  <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <div>
                      <p className="text-xs text-white/40">
                        Order ID
                      </p>

                      <p className="mt-1 font-mono text-xs">
                        #{order.id}
                      </p>
                    </div>

                    <StatusBadge
                      status={order.orderStatus}
                    />
                  </div>

                  {/* ITEMS */}
                  <div className="space-y-3 p-4">
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-medium">
                          {formatINR(
                            item.price * item.quantity,
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* ORDER INFO */}
                  <div className="border-t border-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">
                        Total
                      </span>

                      <span className="text-base font-semibold">
                        {formatINR(order.amount)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                      <Clock3 className="size-3.5" />

                      {formatDate(order.createdAt)}
                    </div>

                    <div className="mt-2 text-xs text-white/40">
                      Payment:{" "}
                      <span className="text-white/70">
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="text-xs font-medium text-white/70">
                        Delivery Address
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/40">
                        {order.address.fullName}
                        <br />
                        {order.address.address},{" "}
                        {order.address.city},{" "}
                        {order.address.state} -{" "}
                        {order.address.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  if (status === "Delivered") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
        <CheckCircle2 className="size-3" />
        Delivered
      </span>
    )
  }

  if (status === "Cancelled") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-400">
        <XCircle className="size-3" />
        Cancelled
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1 rounded-full bg-[#f2b84b]/10 px-2.5 py-1 text-[10px] font-medium text-[#f2b84b]">
      <Clock3 className="size-3" />
      {status}
    </span>
  )
}
