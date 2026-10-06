"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Zap } from "lucide-react"

import { useStore } from "@/lib/store"
import { discountedPrice } from "@/lib/types"
import { formatINR } from "@/lib/format"

type ProductPageProps = {
  params: Promise<{
    id: string
  }>
}

const BUY_NOW_KEY = "timehouse.buyNow"

export default function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = use(params)

  const {
    products,
    addToCart,
    ready,
  } = useStore()

  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading product...
        </p>
      </main>
    )
  }

  const product = products.find(
    (item) => item.id === id
  )

  if (!product) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="text-2xl font-semibold">
          Product not found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          This watch is no longer available.
        </p>

        <Link
          href="/"
          className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Back to Store
        </Link>
      </main>
    )
  }

  const images = [
    product.image,
    ...(product.gallery ?? []),
  ].filter(Boolean)

  const currentImage =
    selectedImage ||
    images[0] ||
    "/placeholder.svg"

  const price = discountedPrice(product)

  function handleAddToCart() {
    if (product.stock <= 0) return

    addToCart(product.id, 1)

    setAdded(true)

    window.setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  function handleBuyNow() {
    if (product.stock <= 0) return

    /*
     * Save the CURRENT selected product temporarily.
     *
     * sessionStorage is used instead of localStorage so
     * an old Buy Now product cannot interfere with normal
     * cart checkout.
     */
    try {
      sessionStorage.setItem(
        BUY_NOW_KEY,
        JSON.stringify({
          productId: product.id,
          quantity: 1,
          product,
        })
      )
    } catch (error) {
      console.error(
        "Unable to save Buy Now product:",
        error
      )
    }

    window.location.href =
      `/checkout?buyNow=${encodeURIComponent(
        product.id
      )}&quantity=1`
  }

  return (
    <main className="min-h-dvh bg-background pb-8">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-full border border-border"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">
              {product.brand || "TimeHub"}
            </p>

            <h1 className="truncate text-sm font-semibold">
              {product.name}
            </h1>
          </div>

          <Link
            href="/cart"
            className="flex size-10 items-center justify-center rounded-full border border-border"
          >
            <ShoppingBag className="size-5" />
          </Link>
        </div>
      </header>

      <section className="px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="aspect-square bg-secondary/20">
            <img
              src={currentImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() =>
                  setSelectedImage(image)
                }
                className={
                  `size-16 shrink-0 overflow-hidden rounded-xl border ` +
                  (
                    currentImage === image
                      ? "border-primary"
                      : "border-border"
                  )
                }
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="px-4 pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {product.brand || "TimeHub"}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {product.name}
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-2xl font-semibold">
            {formatINR(price)}
          </span>

          {product.discount > 0 && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatINR(product.price)}
              </span>

              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">
            Availability
          </p>

          <p
            className={
              `mt-1 text-sm font-semibold ` +
              (
                product.stock > 0
                  ? "text-emerald-600"
                  : "text-red-600"
              )
            }
          >
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-base font-semibold">
            Description
          </h3>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {product.description ||
              "A refined timepiece designed with attention to detail and timeless style."}
          </p>
        </div>
      </section>

      <section className="sticky bottom-0 z-30 mt-8 border-t border-border bg-background/95 p-4 backdrop-blur">
        {added && (
          <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-600">
            Added to cart successfully
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag className="size-4" />
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Zap className="size-4" />
            Buy Now
          </button>
        </div>
      </section>
    </main>
  )
}
