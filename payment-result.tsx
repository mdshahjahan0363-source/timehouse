"use client"

import Link from "next/link"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { formatINR } from "@/lib/format"
import type { PaymentStatus } from "@/lib/types"

export type ResultState = {
  status: PaymentStatus
  orderId: string
  amount: number
} | null

export function PaymentResult({
  result,
  onRetry,
  onClose,
}: {
  result: ResultState
  onRetry: () => void
  onClose: () => void
}) {
  if (!result) return null

  const { status, orderId, amount } = result

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-popover p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4">
        {status === "paid" && (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="size-9 text-success" />
            </div>
            <h2 className="mt-4 font-serif text-2xl text-foreground">
              Order Successful
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Thank you for your purchase. Your order is confirmed.
            </p>
            <div className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-4 text-left">
              <Row label="Order ID" value={orderId} mono />
              <Row label="Amount Paid" value={formatINR(amount)} />
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/history"
                onClick={onClose}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                View in History
              </Link>
              <Link
                href="/"
                onClick={onClose}
                className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-foreground"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/15">
              <XCircle className="size-9 text-destructive" />
            </div>
            <h2 className="mt-4 font-serif text-2xl text-foreground">
              Payment Failed
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We couldn&apos;t process your payment. No amount was charged.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={onRetry}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Retry Payment
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-foreground"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-warning/15">
              <Clock className="size-9 text-warning" />
            </div>
            <h2 className="mt-4 font-serif text-2xl text-foreground">
              Payment Pending
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your payment is being processed. You can retry or check the status
              in your order history.
            </p>
            {orderId && (
              <div className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-4 text-left">
                <Row label="Order ID" value={orderId} mono />
                <Row label="Amount" value={formatINR(amount)} />
              </div>
            )}
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={onRetry}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Retry Payment
              </button>
              <Link
                href="/history"
                onClick={onClose}
                className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-foreground"
              >
                Check Order Status
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium text-foreground ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}
