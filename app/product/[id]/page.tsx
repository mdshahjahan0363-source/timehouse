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

export default function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = use(params)
  const { products, addToCart, ready } = useStore()

  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  const product = products.find((item) => item.id === id)

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading product...
        </p>
      </main>
    )
  }

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
    selectedImage || images[0] || "/placeholder.svg"

  const price = discountedPrice(product)

  function handleAddToCart() {
    addToCart(product.id, 1)
    setAdded(true)

    window.setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  function handleBuyNow() {
    addToCart(product.id, 1)
    window.location.href = "/checkout"
  }

  return (
    <main className="min-h-dvh bg-background pb-8">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-full border border-border"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">
              {product.brand || "AURELIA"}
            </p>
            <h1 className="truncate text-sm font-semibold">
              {product.name}
            </h1>
          </div>

          <Link
            href="/cart"
            className="flex size-10 items-center justify-center rounded-full border border-border"
            aria-label="Cart"
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
                onClick={() => setSelectedImage(image)}
                className={`size-16 shrink-0 overflow-hidden rounded-xl border ${
                  currentImage === image
                    ? "border-primary"
                    : "border-border"
                }`}
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
          {product.brand || "AURELIA"}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {product.name}
        </h2>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold">
            {formatINR(price)}
          </span>

          {product.discount > 0 && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatINR(product.price)}
              </span>

              <span className="rounded
