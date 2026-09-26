"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Package,
  ShoppingBag,
  LogOut,
  Lock,
  Loader2,
  X,
} from "lucide-react"
import { useStore } from "@/lib/store"
import type { Product, OrderStatus } from "@/lib/types"
import { ORDER_STATUSES, discountedPrice } from "@/lib/types"
import { formatINR, formatDate } from "@/lib/format"
import { Field, TextInput } from "@/components/ui/field"
import { ProductForm } from "@/components/admin/product-form"
import { PaymentBadge, OrderStatusBadge, StockBadge } from "@/components/status-badge"
import { Spinner, EmptyState } from "@/components/state-views"
import { useToast } from "@/lib/toast"
import { cn } from "@/lib/utils"

type Tab = "products" | "orders"

export default function AdminPage() {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authenticated)))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <main className="mx-auto min-h-dvh max-w-md bg-background">
        <Spinner label="Checking access..." />
      </main>
    )
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const toast = useToast()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        toast("Welcome back, admin", "success")
        onSuccess()
      } else {
        const d = await res.json().catch(() => ({}))
        toast(d.error ?? "Login failed", "error")
      }
    } catch {
      toast("Login failed. Try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center bg-background px-6">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Lock className="size-8" />
      </div>
      <h1 className="mt-5 text-center font-serif text-2xl text-foreground">
        Admin Access
      </h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Enter your password to manage the store.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <Field label="Password" htmlFor="admin-pw">
          <TextInput
            id="admin-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoFocus
          />
        </Field>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Sign In
        </button>
      </form>
      <Link
        href="/"
        className="mt-4 text-center text-xs text-muted-foreground hover:text-foreground"
      >
        Back to store
      </Link>
    </main>
  )
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const toast = useToast()
  const {
    ready,
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
  } = useStore()
  const [tab, setTab] = useState<Tab>("products")
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)

  const revenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.amount, 0)

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {})
    toast("Logged out", "info")
    onLogout()
  }

  const showForm = creating || editing !== null

  return (
    <main className="mx-auto min-h-dvh max-w-md bg-background pb-10">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-full border border-border text-foreground"
              aria-label="Back to store"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <h1 className="font-serif text-lg leading-tight text-foreground">
                Admin Panel
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Aurelia Watches
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <LogOut className="size-3.5" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4 pb-3">
          <Stat label="Products" value={String(products.length)} />
          <Stat label="Orders" value={String(orders.length)} />
          <Stat label="Revenue" value={formatINR(revenue)} />
        </div>

        <div className="flex border-t border-border">
          <TabButton active={tab === "products"} onClick={() => setTab("products")}>
            <Package className="size-4" />
            Products
          </TabButton>
          <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
            <ShoppingBag className="size-4" />
            Orders
          </TabButton>
        </div>
      </header>

      {!ready ? (
        <Spinner label="Loading..." />
      ) : tab === "products" ? (
        <section className="px-4 pt-4">
          <button
            onClick={() => setCreating(true)}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 py-3 text-sm font-semibold text-primary"
          >
            <Plus className="size-4" />
            Add New Product
          </button>

          {products.length === 0 ? (
            <EmptyState
              icon={<Package className="size-7" />}
              title="No products"
              description="Add your first watch to the catalog."
            />
          ) : (
            <ul className="space-y-3">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                    <Image
                      src={p.image || "/placeholder.svg"}
                      alt={p.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-sm font-medium text-foreground">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {formatINR(discountedPrice(p))}
                      </span>
                      {p.discount > 0 && (
                        <span className="text-[10px] text-primary">
                          -{p.discount}%
                        </span>
                      )}
                    </div>
                    <StockBadge stock={p.stock} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(p)}
                      className="flex size-8 items-center justify-center rounded-lg border border-border text-destructive"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="px-4 pt-4">
          {orders.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="size-7" />}
              title="No orders yet"
              description="Orders placed by customers will appear here."
            />
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-foreground">
                        #{o.id}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <PaymentBadge status={o.paymentStatus} />
                  </div>

                  <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {o.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between text-xs"
                      >
                        <span className="line-clamp-1 text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="shrink-0 text-foreground">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {o.address.fullName} · +91 {o.address.mobile}
                    </p>
                    <p>
                      {o.address.address}, {o.address.city}, {o.address.state} -{" "}
                      {o.address.pincode}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-semibold text-foreground">
                      {formatINR(o.amount)}
                    </span>
                    <OrderStatusBadge status={o.orderStatus} />
                  </div>

                  <div className="mt-3">
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Update Order Status
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ORDER_STATUSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            updateOrderStatus(o.id, status as OrderStatus)
                            toast(`Order marked ${status}`, "success")
                          }}
                          className={cn(
                            "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                            o.orderStatus === status
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-background/70 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-border bg-popover p-4 animate-in slide-in-from-bottom">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-foreground">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => {
                  setEditing(null)
                  setCreating(false)
                }}
                className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <ProductForm
              initial={editing ?? undefined}
              onCancel={() => {
                setEditing(null)
                setCreating(false)
              }}
              onSubmit={(draft) => {
                if (editing) {
                  updateProduct({ ...draft, id: editing.id })
                  toast("Product updated", "success")
                } else {
                  addProduct(draft)
                  toast("Product added", "success")
                }
                setEditing(null)
                setCreating(false)
              }}
            />
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-popover p-5 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <Trash2 className="size-6" />
            </div>
            <h3 className="mt-3 font-serif text-lg text-foreground">
              Delete product?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {confirmDelete.name} will be permanently removed.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(confirmDelete.id)
                  toast("Product deleted", "info")
                  setConfirmDelete(null)
                }}
                className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground",
      )}
    >
      {children}
    </button>
  )
}
