"use client"

import type { OrderStatus, PaymentStatus } from "@/lib/types"

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${className}`}
    >
      {children}
    </span>
  )
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
    pending: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    failed: "border-red-500/30 bg-red-500/10 text-red-600",
  }

  return (
    <Badge className={styles[status]}>
      {status === "paid"
        ? "Paid"
        : status === "pending"
          ? "Pending"
          : "Failed"}
    </Badge>
  )
}

export function OrderStatusBadge({
  status,
}: {
  status: OrderStatus
}) {
  const styles: Record<OrderStatus, string> = {
    Pending: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    Confirmed: "border-blue-500/30 bg-blue-500/10 text-blue-600",
    Shipped: "border-purple-500/30 bg-purple-500/10 text-purple-600",
    Delivered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
    Cancelled: "border-red-500/30 bg-red-500/10 text-red-600",
  }

  return <Badge className={styles[status]}>{status}</Badge>
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <Badge className="border-red-500/30 bg-red-500/10 text-red-600">
        Out of stock
      </Badge>
    )
  }

  if (stock <= 5) {
    return (
      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-600">
        Only {stock} left
      </Badge>
    )
  }

  return (
    <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
      In stock
    </Badge>
  )
}
