import { cn } from "@/lib/utils"
import type { OrderStatus, PaymentStatus } from "@/lib/types"

export function StockBadge({ stock }: { stock: number }) {
  const out = stock <= 0
  const low = stock > 0 && stock <= 3
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        out
          ? "bg-destructive/15 text-destructive"
          : low
            ? "bg-warning/15 text-warning"
            : "bg-success/15 text-success",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          out ? "bg-destructive" : low ? "bg-warning" : "bg-success",
        )}
      />
      {out ? "Out of stock" : low ? `Only ${stock} left` : "In stock"}
    </span>
  )
}

const paymentStyles: Record<PaymentStatus, string> = {
  paid: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  failed: "bg-destructive/15 text-destructive",
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        paymentStyles[status],
      )}
    >
      {status}
    </span>
  )
}

const orderStyles: Record<OrderStatus, string> = {
  Pending: "bg-muted text-muted-foreground",
  Confirmed: "bg-chart-2/15 text-chart-2",
  Shipped: "bg-primary/15 text-primary",
  Delivered: "bg-success/15 text-success",
  Cancelled: "bg-destructive/15 text-destructive",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        orderStyles[status],
      )}
    >
      {status}
    </span>
  )
}
