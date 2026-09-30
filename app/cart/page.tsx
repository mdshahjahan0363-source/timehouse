"use client"

import Link from "next/link"
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { useStore } from "@/lib/store"
import { discountedPrice } from "@/lib/types"
import { formatINR } from "@/lib/format"

export default function CartPage() {
  const {
    products,
    cart,
    ready,
    setQuantity,
    removeFromCart,
  } = useStore()

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading cart...
        </p>
      </main>
    )
  }

  const items = cart
    .map((item) => {
      const product = products.find(
        (p) => p.id === item.productId
      )

      if (!product) return null

      return {
        product,
        quantity: item.quantity,
      }
    })
    .filter(Boolean) as Array<{
    product: (typeof products)[number]
    quantity: number
  }>

  const total = items.reduce(
    (sum, item) =>
      sum +
      discountedPrice(item.product) * item.quantity,
    0
  )

  if (items.length === 0) {
    return (
      <main className="min-h-dvh bg-background">
        <header className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex size-10 items-center justify-center rounded-full border border-border"
            >
              <ArrowLeft className="size-5" />
            </Link>

            <h1 className="text-lg font-semibold">
              Shopping Cart
            </h1>
          </div>
        </header>

        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <ShoppingBag className="size-14 text-muted-foreground" />

          <h2 className="mt-5 text-xl font-semibold">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add a beautiful timepiece to your cart.
          </p>

          <Link
            href="/"
            className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Explore Collection
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background pb-32">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
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
              Shopping Cart
            </h1>
          </div>
        </div>
      </header>

      <section className="space-y-3 px-4 pt-5">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="rounded-2xl border border-border bg-card p-3"
          >
            <div className="flex gap-3">
              <Link
                href={`/product/${product.id}`}
                className="size-24 shrink-0 overflow-hidden rounded-xl bg-secondary/20"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${product.id}`}
                  className="block truncate text-sm font-semibold"
                >
                  {product.name}
                </Link>

                <p className="mt-1 text-sm font-semibold">
                  {formatINR(
                    discountedPrice(product)
                  )}
                </p>

                {product.discount > 0 && (
                  <p className="text-xs text-muted-foreground line-through">
                    {formatINR(product.price)}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          product.id,
                          Math.max(1, quantity - 1)
                        )
                      }
                      className="flex size-9 items-center justify-center"
                    >
                      <Minus className="size-4" />
                    </button>

                    <span className="w-8 text-center text-sm font-semibold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      disabled={
                        quantity >= product.stock
                      }
                      onClick={() =>
                        setQuantity(
                          product.id,
                          Math.min(
                            product.stock,
                            quantity + 1
                          )
                        )
                      }
                      className="flex size-9 items-center justify-center disabled:opacity-40"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(product.id)
                    }
                    className="flex size-9 items-center justify-center rounded-lg text-red-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6 px-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-base font-semibold">
            Price Details
          </h2>

          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted-foreground">
              Items
            </span>

            <span>{items.length}</span>
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span className="text-muted-foreground">
              Total Quantity
            </span>

            <span>
              {items.reduce(
                (sum, item) => sum + item.quantity,
                0
              )}
            </span>
          </div>

          <div className="my-4 border-t border-border" />

          <div className="flex items-center justify-between">
            <span className="font-semibold">
              Total Amount
            </span>

            <span className="text-xl font-semibold">
              {formatINR(total)}
            </span>
          </div>
        </div>
      </section>

      <section className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/checkout"
            className="flex w-full items-center justify-center rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground"
          >
            Proceed to Checkout
          </Link>
        </div>
      </section>
    </main>
  )
}
