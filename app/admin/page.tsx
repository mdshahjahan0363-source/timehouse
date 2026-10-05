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
  Headphones,
  Settings,
  Upload,
  ImageIcon,
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
        order.paymentStatus === "paid",
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load support",
        )
      }

      setSupport(data.support || [])
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
      "id" | "createdAt" | "updatedAt"
    >,
  ) {
    try {
      const response = await fetch(
        "/api/admin/support",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
            "Content-Type": "application/json",
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
            "Content-Type": "application/json",
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
              value={String(
                products.length,
              )}
            />

            <Stat
              label="Orders"
              value={String(
                orders.length,
              )}
            />

            <Stat
              label="Revenue"
              value={formatINR(revenue)}
            />
          </div>

          <div className="flex overflow-x-auto border-t border-border">
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

            <TabButton
              active={tab === "support"}
              onClick={() =>
                setTab("support")
              }
            >
              <Headphones className="size-4" />
              Support
            </TabButton>

            <TabButton
              active={tab === "settings"}
              onClick={() =>
                setTab("settings")
              }
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
        ) : tab === "orders" ? (
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
        ) : tab === "support" ? (
          <SupportSection
            support={support}
            loading={supportLoading}
            onAdd={() =>
              setSupportCreating(true)
            }
            onEdit={(item) =>
              setSupportEditing(item)
            }
            onDelete={(item) =>
              setSupportDelete(item)
            }
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

      {showSupportForm && (
        <SupportFormModal
          initial={
            supportEditing ?? undefined
          }
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
                onClick={() =>
                  setSupportDelete(null)
                }
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  deleteSupport(
                    supportDelete,
                  )
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
              <div className
