"use client"

import { useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
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
import {
  ORDER_STATUSES,
  discountedPrice,
} from "@/lib/types"
import { formatINR, formatDate } from "@/lib/format"
import { Field, TextInput } from "@/components/ui/field"
import { ProductForm } from "@/components/admin/product-form"
import {
  PaymentBadge,
  OrderStatusBadge,
  StockBadge,
} from "@/components/status-badge"
import {
  Spinner,
  EmptyState,
} from "@/components/state-views"
import { useToast } from "@/lib/toast"
import { cn } from "@/lib/utils"

type Tab = "products" | "orders"

export default function AdminPage() {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        setAuthed(Boolean(data.authenticated))
      })
      .catch(() => {
        setAuthed(false)
      })
      .finally(() => {
        setChecking(false)
      })
  }, [])

  if (checking) {
    return (
      <main className="min-h-dvh bg-background">
        <Spinner label="Checking access..." />
      </main>
    )
  }

  if (!authed) {
    return (
      <AdminLogin
        onSuccess={() => setAuthed(true)}
      />
    )
  }

  return (
    <AdminDashboard
      onLogout={() => setAuthed(false)}
    />
  )
}

function AdminLogin({
  onSuccess,
}: {
  onSuccess: () => void
}) {
  const toast = useToast()

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!password.trim()) {
      toast("Enter admin password", "error")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        },
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (response.ok) {
        toast(
          "Welcome back, admin",
          "success",
        )

        onSuccess()
      } else {
        toast(
          data.error || "Invalid password",
          "error",
        )
      }
    } catch {
      toast(
        "Login failed. Try again.",
        "error",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Lock className="size-8" />
        </div>

        <h1 className="mt-5 text-center font-serif text-2xl text-foreground">
          Admin Access
        </h1>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your password to manage the store.
        </p>

        <form
          onSubmit={submit}
          className="mt-6 space-y-4"
        >
          <Field
            label="Password"
            htmlFor="admin-password"
          >
            <TextInput
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Admin password"
              autoFocus
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Sign In
          </button>
        </form>

        <Link
          href="/"
          className="mt-5 block text-center text-xs text-muted-foreground"
        >
          Back to store
        </Link>
      </div>
    </main>
  )
}

function AdminDashboard({
  onLogout,
}: {
  onLogout: () => void
}) {
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

  const [tab, setTab] =
    useState<Tab>("products")

  const [editing, setEditing] =
    useState<Product | null>(null)

  const [creating, setCreating] =
    useState(false)

  const [confirmDelete, setConfirmDelete] =
    useState<Product | null>(null)

  const revenue = orders
    .filter(
      (order) =>
        order.paymentStatus === "paid",
    )
    .reduce(
      (total, order) =>
        total + order.amount,
      0,
    )

  async function logout() {
    await fetch(
      "/api/admin/session",
      {
        method: "DELETE",
      },
    ).catch(() => {})

    toast("Logged out", "info")
    onLogout()
  }

  const showForm =
    creating || editing !== null

  return (
    <main className="min-h-dvh bg-background pb-10">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex size-9 items-center justify-center rounded-full border border-border"
                aria-label="Back to store"
              >
                <ArrowLeft className="size-4" />
              </Link>

              <div>
                <h1 className="font-serif text-lg">
                  Admin Panel
                </h1>

                <p className="text-[11px] text-muted-foreground">
                  TIMEHUB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs"
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4 pb-3">
            <Stat
              label="Products"
              value={String(products.length)}
            />

            <Stat
              label="Orders"
              value={String(orders.length)}
            />

            <Stat
              label="Revenue"
              value={formatINR(revenue)}
            />
          </div>

          <div className="flex border-t border-border">
            <TabButton
              active={tab === "products"}
              onClick={() =>
                setTab("products")
              }
            >
              <Package className="size-4" />
              Products
            </TabButton>

            <TabButton
              active={tab === "orders"}
              onClick={() =>
                setTab("orders")
              }
            >
              <ShoppingBag className="size-4" />
              Orders
            </TabButton>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md">
        {!ready ? (
          <Spinner label="Loading..." />
        ) : tab === "products" ? (
          <ProductsSection
            products={products}
            onAdd={() =>
              setCreating(true)
            }
            onEdit={(product) =>
              setEditing(product)
            }
            onDelete={(product) =>
              setConfirmDelete(product)
            }
          />
        ) : (
          <OrdersSection
            orders={orders}
            onStatusChange={(
              orderId,
              status,
            ) => {
              updateOrderStatus(
                orderId,
                status,
              )

              toast(
                `Order marked ${status}`,
                "success",
              )
            }}
          />
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-border bg-popover p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg">
                {editing
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setCreating(false)
                }}
                className="flex size-8 items-center justify-center rounded-full border border-border"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <ProductForm
              initial={
                editing ?? undefined
              }
              onCancel={() => {
                setEditing(null)
                setCreating(false)
              }}
              onSubmit={(draft) => {
                if (editing) {
                  updateProduct({
                    ...draft,
                    id: editing.id,
                  })

                  toast(
                    "Product updated",
                    "success",
                  )
                } else {
                  addProduct(draft)

                  toast(
                    "Product added",
                    "success",
                  )
                }

                setEditing(null)
                setCreating(false)
              }}
            />
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-popover p-5 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <Trash2 className="size-6" />
            </div>

            <h3 className="mt-3 font-serif text-lg">
              Delete product?
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {confirmDelete.name} will be permanently removed.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setConfirmDelete(null)
                }
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteProduct(
                    confirmDelete.id,
                  )

                  toast(
                    "Product deleted",
                    "info",
                  )

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

function ProductsSection({
  products,
  onAdd,
  onEdit,
  onDelete,
}: {
  products: Product[]
  onAdd: () => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}) {
  return (
    <section className="px-4 pt-4">
      <button
        type="button"
        onClick={onAdd}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 py-3 text-sm font-semibold text-primary"
      >
        <Plus className="size-4" />
        Add New Product
      </button>

      {products.length === 0 ? (
        <EmptyState
          icon={
            <Package className="size-7" />
          }
          title="No products"
          description="Add your first watch to the catalog."
        />
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                <Image
                  src={
                    product.image ||
                    "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 text-sm font-medium">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {formatINR(
                      discountedPrice(
                        product,
                      ),
                    )}
                  </span>

                  {product.discount > 0 && (
                    <span className="text-[10px] text-primary">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <StockBadge
                  stock={product.stock}
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onEdit(product)
                  }
                  className="flex size-8 items-center justify-center rounded-lg border border-border"
                  aria-label="Edit product"
                >
                  <Pencil className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(product)
                  }
                  className="flex size-8 items-center justify-center rounded-lg border border-border text-destructive"
                  aria-label="Delete product"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function OrdersSection({
  orders,
  onStatusChange,
}: {
  orders: Array<{
    id: string
    createdAt: number
    items: Array<{
      productId: string
      name: string
      price: number
      quantity: number
    }>
    amount: number
    address: {
      fullName: string
      mobile: string
      address: string
      city: string
      state: string
      pincode: string
    }
    paymentStatus:
      | "paid"
      | "pending"
      | "failed"
    orderStatus: OrderStatus
  }>
  onStatusChange: (
    id: string,
    status: OrderStatus,
  ) => void
}) {
  return (
    <section className="px-4 pt-4">
      {orders.length === 0 ? (
        <EmptyState
          icon={
            <ShoppingBag className="size-7" />
          }
          title="No orders yet"
          description="Customer orders will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs">
                    #{order.id}
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    {formatDate(
                      order.createdAt,
                    )}
                  </p>
                </div>

                <PaymentBadge
                  status={
                    order.paymentStatus
                  }
                />
              </div>

              <div className="mt-3 space-y-2 border-t border-border pt-3">
                {order.items.map(
                  (item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-xs"
                    >
                      <span className="line-clamp-1 text-muted-foreground">
                        {item.name} ×{" "}
                        {item.quantity}
                      </span>

                      <span>
                        {formatINR(
                          item.price *
                            item.quantity,
                        )}
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">
                  {order.address.fullName}
                  {" · +91 "}
                  {order.address.mobile}
                </p>

                <p>
                  {order.address.address},{" "}
                  {order.address.city},{" "}
                  {order.address.state} -{" "}
                  {order.address.pincode}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold">
                  {formatINR(
                    order.amount,
                  )}
                </span>

                <OrderStatusBadge
                  status={
                    order.orderStatus
                  }
                />
              </div>

              <div className="mt-3">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Update Order Status
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {ORDER_STATUSES.map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          onStatusChange(
                            order.id,
                            status,
                          )
                        }
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-medium",
                          order.orderStatus ===
                            status
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        {status}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Stat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="truncate text-sm font-semibold">
        {value}
      </p>
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
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-medium",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground",
      )}
    >
      {children}
    </button>
  )
}
