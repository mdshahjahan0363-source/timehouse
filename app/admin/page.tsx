"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  LogOut,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react"

import type { Product } from "@/lib/types"
import { discountedPrice } from "@/lib/types"
import { useStore } from "@/lib/store"
import { formatINR } from "@/lib/format"
import { ProductForm } from "@/components/admin/product-form"

type Tab = "products" | "orders"

export default function AdminPage() {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
  } = useStore()

  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("products")
  const [editingProduct, setEditingProduct] =
    useState<Product | undefined>()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(
          "/api/admin/session",
          { cache: "no-store" }
        )

        setAuthenticated(response.ok)
      } catch {
        setAuthenticated(false)
      } finally {
        setChecking(false)
      }
    }

    checkSession()
  }, [])

  async function login() {
    setLoginError("")

    if (!password.trim()) {
      setLoginError("Password enter karein.")
      return
    }

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (!response.ok) {
        setLoginError(
          data.error || "Login failed."
        )
        return
      }

      setPassword("")
      setAuthenticated(true)
    } catch {
      setLoginError(
        "Login failed. Please try again."
      )
    }
  }

  async function logout() {
    try {
      await fetch(
        "/api/admin/session",
        {
          method: "DELETE",
        }
      )
    } catch {
      // ignore
    }

    setAuthenticated(false)
  }

  function openAdd() {
    setEditingProduct(undefined)
    setShowForm(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setShowForm(true)
  }

  function closeForm() {
    setEditingProduct(undefined)
    setShowForm(false)
  }

  async function handleProductSubmit(
    draft: Omit<Product, "id">
  ) {
    if (editingProduct) {
      await updateProduct({
        ...editingProduct,
        ...draft,
      })
    } else {
      await addProduct(draft)
    }

    closeForm()
  }

  async function handleDelete(product: Product) {
    const ok = window.confirm(
      `"${product.name}" delete karna hai?`
    )

    if (!ok) return

    await deleteProduct(product.id)
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="text-sm text-muted-foreground">
          Checking admin access...
        </div>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Package className="size-6" />
            </div>

            <h1 className="text-xl font-semibold">
              Admin Access
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter your admin password
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              login()
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Admin password"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              autoComplete="current-password"
            />

            {loginError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              Sign In
            </button>
          </form>

          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to store
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              AURELIA Admin
            </h1>

            <p className="text-xs text-muted-foreground">
              Store management
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-border px-3 py-2 text-xs font-medium"
            >
              Store
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">

        {/* TABS */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setActiveTab("products")
            }
            className={`rounded-xl border p-4 text-left ${
              activeTab === "products"
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <Package className="mb-2 size-5" />

            <div className="text-lg font-semibold">
              {products.length}
            </div>

            <div className="text-xs text-muted-foreground">
              Products
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("orders")
            }
            className={`rounded-xl border p-4 text-left ${
              activeTab === "orders"
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <ShoppingBag className="mb-2 size-5" />

            <div className="text-lg font-semibold">
              {orders.length}
            </div>

            <div className="text-xs text-muted-foreground">
              Orders
            </
