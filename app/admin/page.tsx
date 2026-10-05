"use client"

import {
  useEffect,
  useState,
  type ReactNode,
} from "react"
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
  Headphones,
  Settings,
  Upload,
  ImageIcon,
} from "lucide-react"

import { useStore } from "@/lib/store"
import type {
  Product,
  OrderStatus,
} from "@/lib/types"

import {
  ORDER_STATUSES,
  discountedPrice,
} from "@/lib/types"

import {
  formatINR,
  formatDate,
} from "@/lib/format"

import {
  Field,
  TextInput,
} from "@/components/ui/field"

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

type Tab =
  | "products"
  | "orders"
  | "support"
  | "settings"

type SupportOption = {
  id: string
  title: string
  description: string
  type: string
  link: string
  enabled: boolean
  createdAt?: number
  updatedAt?: number
}

type SiteSettings = {
  siteName: string
  tagline: string
  logoUrl: string
}

export default function AdminPage() {
  const [checking, setChecking] =
    useState(true)

  const [authed, setAuthed] =
    useState(false)

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        setAuthed(
          Boolean(data.authenticated),
        )
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
        onSuccess={() =>
          setAuthed(true)
        }
      />
    )
  }

  return (
    <AdminDashboard
      onLogout={() =>
        setAuthed(false)
      }
    />
  )
}

function AdminLogin({
  onSuccess,
}: {
  onSuccess: () => void
}) {
  const toast = useToast()

  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!password.trim()) {
      toast(
        "Enter admin password",
        "error",
      )
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        },
      )

      const data =
        await response
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
          data.error ||
            "Invalid password",
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
                setPassword(
                  event.target.value,
                )
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

  const [support, setSupport] =
    useState<SupportOption[]>([])

  const [supportLoading, setSupportLoading] =
    useState(false)

  const [supportEditing, setSupportEditing] =
    useState<SupportOption | null>(null)

  const [supportCreating, setSupportCreating] =
    useState(false)

  const [supportDelete, setSupportDelete] =
    useState<SupportOption | null>(null)

  const revenue = orders
    .filter(
      (order) =>
        order.paymentStatus ===
        "paid",
    )
    .reduce(
      (total, order) =>
        total + order.amount,
      0,
    )

  useEffect(() => {
    if (tab !== "support") return

    loadSupport()
  }, [tab])

  async function loadSupport() {
    setSupportLoading(true)

    try {
      const response = await fetch(
        "/api/admin/support",
        {
          cache: "no-store",
        },
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load support",
        )
      }

      setSupport(
        data.support || [],
      )
    } catch {
      toast(
        "Failed to load support options",
        "error",
      )
    } finally {
      setSupportLoading(false)
    }
  }

  async function addSupport(
    data: Omit<
      SupportOption,
      "id" |
        "createdAt" |
        "updatedAt"
    >,
  ) {
    try {
      const response = await fetch(
        "/api/admin/support",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        },
      )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to add support",
        )
      }

      toast(
        "Support option added",
        "success",
      )

      setSupportCreating(false)

      await loadSupport()
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Failed to add support",
        "error",
      )
    }
  }

  async function updateSupport(
    data: SupportOption,
  ) {
    try {
      const response = await fetch(
        "/api/admin/support",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        },
      )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to update support",
        )
      }

      toast(
        "Support option updated",
        "success",
      )

      setSupportEditing(null)

      await loadSupport()
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Failed to update support",
        "error",
      )
    }
  }

  async function deleteSupport(
    item: SupportOption,
  ) {
    try {
      const response = await fetch(
        "/api/admin/support",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: item.id,
          }),
        },
      )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to delete support",
        )
      }

      toast(
        "Support option deleted",
        "info",
      )

      setSupportDelete(null)

      await loadSupport()
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Failed to delete support",
        "error",
      )
    }
  }

  async function toggleSupport(
    item: SupportOption,
  ) {
    await updateSupport({
      ...item,
      enabled: !item.enabled,
    })
  }

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

  const showSupportForm =
    supportCreating ||
    supportEditing !== null
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

          <div className="flex overflow-x-auto border-t border-border">
            <TabButton
              active={tab === "products"}
              onClick={() => setTab("products")}
            >
              <Package className="size-4" />
              Products
            </TabButton>

            <TabButton
              active={tab === "orders"}
              onClick={() => setTab("orders")}
            >
              <ShoppingBag className="size-4" />
              Orders
            </TabButton>

            <TabButton
              active={tab === "support"}
              onClick={() => setTab("support")}
            >
              <Headphones className="size-4" />
              Support
            </TabButton>

            <TabButton
              active={tab === "settings"}
              onClick={() => setTab("settings")}
            >
              <Settings className="size-4" />
              Settings
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
            onAdd={() => setCreating(true)}
            onEdit={(product) => setEditing(product)}
            onDelete={(product) =>
              setConfirmDelete(product)
            }
          />
        ) : tab === "orders" ? (
          <OrdersSection
            orders={orders}
            onStatusChange={(orderId, status) => {
              updateOrderStatus(orderId, status)

              toast(
                `Order marked ${status}`,
                "success",
              )
            }}
          />
        ) : tab === "support" ? (
          <SupportSection
            support={support}
            loading={supportLoading}
            onAdd={() => setSupportCreating(true)}
            onEdit={(item) => setSupportEditing(item)}
            onDelete={(item) => setSupportDelete(item)}
            onToggle={toggleSupport}
          />
        ) : (
          <SettingsSection />
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
              initial={editing ?? undefined}
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
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteProduct(confirmDelete.id)

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

      {showSupportForm && (
        <SupportFormModal
          initial={supportEditing ?? undefined}
          onClose={() => {
            setSupportCreating(false)
            setSupportEditing(null)
          }}
          onSubmit={(data) => {
            if (supportEditing) {
              updateSupport({
                ...data,
                id: supportEditing.id,
              })
            } else {
              addSupport(data)
            }
          }}
        />
      )}

      {supportDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-popover p-5 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <Trash2 className="size-6" />
            </div>

            <h3 className="mt-3 font-serif text-lg">
              Delete support option?
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {supportDelete.title} will be permanently removed.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setSupportDelete(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  deleteSupport(supportDelete)
                }
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
          icon={<Package className="size-7" />}
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
                      discountedPrice(product),
                    )}
                  </span>

                  {product.discount > 0 && (
                    <span className="text-[10px] text-primary">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <StockBadge stock={product.stock} />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="flex size-8 items-center justify-center rounded-lg border border-border"
                  aria-label="Edit product"
                >
                  <Pencil className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(product)}
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

function SupportSection({
  support,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
}: {
  support: SupportOption[]
  loading: boolean
  onAdd: () => void
  onEdit: (
    item: SupportOption,
  ) => void
  onDelete: (
    item: SupportOption,
  ) => void
  onToggle: (
    item: SupportOption,
  ) => void
}) {
  return (
    <section className="px-4 pt-4">
      <button
        type="button"
        onClick={onAdd}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 py-3 text-sm font-semibold text-primary"
      >
        <Plus className="size-4" />
        Add Support Option
      </button>

      {loading ? (
        <Spinner label="Loading support..." />
      ) : support.length === 0 ? (
        <EmptyState
          icon={
            <Headphones className="size-7" />
          }
          title="No support options"
          description="Add WhatsApp, Email, Phone or social media support."
        />
      ) : (
        <ul className="space-y-3">
          {support.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Headphones className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold">
                      {item.title}
                    </h3>

                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] uppercase text-muted-foreground">
                      {item.type}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description ||
                      "No description"}
                  </p>

                  <p className="mt-2 break-all text-[10px] text-muted-foreground">
                    {item.link}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() =>
                    onToggle(item)
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-medium",
                    item.enabled
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {item.enabled
                    ? "Enabled"
                    : "Disabled"}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(item)
                    }
                    className="flex size-8 items-center justify-center rounded-lg border border-border"
                    aria-label="Edit support"
                  >
                    <Pencil className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(item)
                    }
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-destructive"
                    aria-label="Delete support"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function SupportFormModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial?: SupportOption
  onClose: () => void
  onSubmit: (
    data: Omit<
      SupportOption,
      "id" |
        "createdAt" |
        "updatedAt"
    >,
  ) => void
}) {
  const [title, setTitle] =
    useState(initial?.title || "")

  const [description, setDescription] =
    useState(
      initial?.description || "",
    )

  const [type, setType] =
    useState(
      initial?.type || "contact",
    )

  const [link, setLink] =
    useState(initial?.link || "")

  const [enabled, setEnabled] =
    useState(
      initial?.enabled !== false,
    )

  function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!title.trim()) return
    if (!link.trim()) return

    onSubmit({
      title: title.trim(),
      description:
        description.trim(),
      type:
        type.trim() || "contact",
      link: link.trim(),
      enabled,
    })
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-border bg-popover p-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg">
              {initial
                ? "Edit Support"
                : "Add Support"}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Manage customer support contact.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full border border-border"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <Field
            label="Title"
            htmlFor="support-title"
          >
            <TextInput
              id="support-title"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              placeholder="WhatsApp"
            />
          </Field>

          <Field
            label="Description"
            htmlFor="support-description"
          >
            <TextInput
              id="support-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              placeholder="Chat with us on WhatsApp"
            />
          </Field>

          <Field
            label="Type"
            htmlFor="support-type"
          >
            <TextInput
              id="support-type"
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value,
                )
              }
              placeholder="whatsapp / email / phone / instagram / facebook"
            />
          </Field>

          <Field
            label="Link"
            htmlFor="support-link"
          >
            <TextInput
              id="support-link"
              value={link}
              onChange={(event) =>
                setLink(
                  event.target.value,
                )
              }
              placeholder="https://wa.me/..."
            />
          </Field>

          <label className="flex items-center gap-3 rounded-xl border border-border p-3">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) =>
                setEnabled(
                  event.target.checked,
                )
              }
              className="size-4"
            />

            <span className="text-sm">
              Show on customer support page
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              {initial
                ? "Save Changes"
                : "Add Support"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
function SettingsSection() {
  const toast = useToast()

  const [settings, setSettings] =
    useState<SiteSettings>({
      siteName: "TIMEHUB",
      tagline: "Luxury Timepieces",
      logoUrl: "",
    })

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [logoPreview, setLogoPreview] =
    useState("")

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)

    try {
      const response = await fetch(
        "/api/admin/settings",
        {
          cache: "no-store",
        },
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load settings",
        )
      }

      const saved =
        data.settings || data

      const nextSettings = {
        siteName:
          saved.siteName ||
          "TIMEHUB",
        tagline:
          saved.tagline ||
          "Luxury Timepieces",
        logoUrl:
          saved.logoUrl || "",
      }

      setSettings(nextSettings)
      setLogoPreview(
        nextSettings.logoUrl,
      )
    } catch {
      toast(
        "Failed to load settings",
        "error",
      )
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings(
    nextSettings: SiteSettings,
  ) {
    setSaving(true)

    try {
      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            nextSettings,
          ),
        },
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save settings",
        )
      }

      setSettings(nextSettings)
      setLogoPreview(
        nextSettings.logoUrl,
      )

      toast(
        "Settings saved successfully",
        "success",
      )
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Failed to save settings",
        "error",
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleLogoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast(
        "Please select an image",
        "error",
      )
      return
    }

    try {
      setSaving(true)

      const logo =
        await compressLogo(file)

      if (logo.length > 650000) {
        toast(
          "Logo is too large. Please choose a smaller image.",
          "error",
        )
        setSaving(false)
        return
      }

      const nextSettings = {
        ...settings,
        logoUrl: logo,
      }

      await saveSettings(
        nextSettings,
      )
    } catch {
      setSaving(false)

      toast(
        "Failed to process logo",
        "error",
      )
    }

    event.target.value = ""
  }

  async function removeLogo() {
    const nextSettings = {
      ...settings,
      logoUrl: "",
    }

    await saveSettings(
      nextSettings,
    )
  }

  async function saveTextSettings() {
    await saveSettings(settings)
  }

  if (loading) {
    return (
      <section className="px-4 pt-4">
        <Spinner label="Loading settings..." />
      </section>
    )
  }

  return (
    <section className="px-4 pt-4 pb-8">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-5">
          <h2 className="font-serif text-lg">
            Website Settings
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Change your website name, tagline and logo.
          </p>
        </div>

        <div className="space-y-5">
          <Field
            label="Website Name"
            htmlFor="site-name"
          >
            <TextInput
              id="site-name"
              value={settings.siteName}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  siteName:
                    event.target.value,
                })
              }
              placeholder="TIMEHUB"
            />
          </Field>

          <Field
            label="Tagline"
            htmlFor="site-tagline"
          >
            <TextInput
              id="site-tagline"
              value={settings.tagline}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  tagline:
                    event.target.value,
                })
              }
              placeholder="Luxury Timepieces"
            />
          </Field>

          <div>
            <p className="mb-2 text-sm font-medium">
              Website Logo
            </p>

            <div className="rounded-2xl border border-dashed border-border p-4">
              {logoPreview ? (
                <div className="flex flex-col items-center">
                  <div className="relative flex size-36 items-center justify-center overflow-hidden rounded-2xl border border-border bg-black p-3">
                    <img
                      src={logoPreview}
                      alt="TIMEHUB logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">
                    Current website logo
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-muted-foreground">
                  <ImageIcon className="size-10" />

                  <p className="mt-2 text-xs">
                    No logo selected
                  </p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
                  <Upload className="size-4" />

                  {logoPreview
                    ? "Change Logo"
                    : "Upload Logo"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleLogoChange
                    }
                    className="hidden"
                  />
                </label>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl border border-destructive px-4 py-3 text-sm font-semibold text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </button>
                )}
              </div>

              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                Use a clear square PNG, JPG or WebP logo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={saveTextSettings}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Save Website Settings
          </button>
        </div>
      </div>
    </section>
  )
}

async function compressLogo(
  file: File,
): Promise<string> {
  const image =
    await loadImage(file)

  const maxSize = 512

  const scale = Math.min(
    1,
    maxSize /
      Math.max(
        image.naturalWidth,
        image.naturalHeight,
      ),
  )

  const width = Math.max(
    1,
    Math.round(
      image.naturalWidth * scale,
    ),
  )

  const height = Math.max(
    1,
    Math.round(
      image.naturalHeight * scale,
    ),
  )

  const canvas =
    document.createElement("canvas")

  canvas.width = width
  canvas.height = height

  const context =
    canvas.getContext("2d")

  if (!context) {
    throw new Error(
      "Canvas is not supported",
    )
  }

  context.clearRect(
    0,
    0,
    width,
    height,
  )

  context.drawImage(
    image,
    0,
    0,
    width,
    height,
  )

  let quality = 0.75
  let result =
    canvas.toDataURL(
      "image/webp",
      quality,
    )

  while (
    result.length > 600000 &&
    quality > 0.4
  ) {
    quality -= 0.05

    result =
      canvas.toDataURL(
        "image/webp",
        quality,
      )
  }

  return result
}

function loadImage(
  file: File,
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const url =
        URL.createObjectURL(file)

      const image =
        new window.Image()

      image.onload = () => {
        URL.revokeObjectURL(url)
        resolve(image)
      }

      image.onerror = () => {
        URL.revokeObjectURL(url)
        reject(
          new Error(
            "Unable to read image",
          ),
        )
      }

      image.src = url
    },
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
        "flex min-w-[25%] flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-medium",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground",
      )}
    >
      {children}
    </button>
  )
}
