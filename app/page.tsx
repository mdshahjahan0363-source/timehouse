"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react"

import { useStore } from "@/lib/store"
import { discountedPrice } from "@/lib/types"

export default function HomePage() {
  const { products, cartCount, ready } = useStore()

  return (
    <main className="min-h-screen bg-[#0b0a08] text-white">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0a08]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-4">
          <div className="flex items-center justify-between">

            <Link
              href="/"
              className="text-xl tracking-[0.22em]"
            >
              TIME<span className="text-[#d8a84e]">HUB</span>
            </Link>

            <div className="flex items-center gap-3">

              <Link
                href="/cart"
                className="relative rounded-full border border-white/15 p-3"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f2b84b] px-1 text-xs text-black">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/admin"
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70"
              >
                Admin
              </Link>

            </div>
          </div>

          <p className="mt-2 text-[11px] tracking-[0.25em] text-white/45">
            Luxury Timepieces
          </p>
        </div>
      </header>

      {/* Search */}
      <section className="border-b border-white/10 px-5 py-3">
        <div className="mx-auto max-w-7xl">

          <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/15 bg-[#151310] px-4">

            <span className="text-2xl leading-none text-white/45">
              ⌕
            </span>

            <span className="text-base text-white/45">
              Search watches
            </span>

          </div>

        </div>
      </section>

      {/* Hero */}
      <section className="px-5 pt-5">
        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#171310]">

            {/* Decorative watch */}
            <div className="pointer-events-none absolute -right-16 top-3 opacity-25">

              <div className="flex h-52 w-36 items-center justify-center rounded-[60px] border-[17px] border-[#8d6725]">

                <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-[#8d6725]">

                  <div className="h-10 w-2 rounded-full bg-[#8d6725]" />

                </div>

              </div>

            </div>

            <div className="relative px-9 py-5 sm:px-12 sm:py-7">

              <p className="text-[10px] uppercase tracking-[0.4em] text-[#d8a84e]">
                New Collection
              </p>

              <h1 className="mt-3 max-w-[330px] font-serif text-[30px] leading-[1.12] text-white sm:text-5xl">
                Timeless
                <br />
                craftsmanship
                <br />
                on your wrist
              </h1>

              <p className="mt-3 max-w-[360px] text-xs leading-5 text-white/55 sm:text-sm">
                Hand-picked luxury watches, delivered with care.
              </p>

              <a
                href="#collection"
                className="mt-4 inline-flex rounded-full bg-[#f2b84b] px-6 py-2.5 text-sm font-medium text-black"
              >
                Explore Collection
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* Features */}
      <section className="px-5 pt-4">

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3">

          {/* Authentic */}
          <div className="flex min-h-[92px] items-center gap-3 rounded-2xl border border-white/10 bg-[#151310] px-4 py-3">

            <ShieldCheck
              size={25}
              className="shrink-0 text-[#d8a84e]"
            />

            <div>
              <p className="text-sm font-medium">
                Authentic
              </p>

              <p className="mt-0.5 text-xs text-white/45">
                100% genuine
              </p>
            </div>

          </div>

          {/* Fast Delivery */}
          <div className="flex min-h-[92px] items-center gap-3 rounded-2xl border border-white/10 bg-[#151310] px-4 py-3">

            <Truck
              size={25}
              className="shrink-0 text-[#d8a84e]"
            />

            <div>
              <p className="text-sm font-medium">
                Fast Delivery
              </p>

              <p className="mt-0.5 text-xs text-white/45">
                Across India
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* Products */}
      <section
        id="collection"
        className="mx-auto max-w-7xl px-5 py-8"
      >

        <div className="mb-5 flex items-end justify-between">

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d8a84e]">
              Our Collection
            </p>

            <h2 className="mt-1 font-serif text-2xl">
              All Watches
            </h2>
          </div>

          <span className="text-sm text-white/45">
            {products.length} items
          </span>

        </div>

        {!ready ? (

          <div className="py-16 text-center text-white/50">
            Loading collection...
          </div>

        ) : products.length === 0 ? (

          <div className="rounded-2xl border border-white/10 py-16 text-center text-white/50">
            No products available.
          </div>

        ) : (

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

            {products.map((product) => {

              const salePrice = discountedPrice(product)

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151310]"
                >

                  <div className="relative aspect-square overflow-hidden bg-[#171512]">

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {product.discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#f2b84b] px-2.5 py-1 text-[10px] font-semibold text-black">
                        -{product.discount}%
                      </span>
                    )}

                    {product.stock <= 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs">
                          Out of stock
                        </span>
                      </div>
                    )}

                  </div>

                  <div className="p-4">

                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#d8a84e]">
                      {product.brand || "TIMEHUB"}
                    </p>

                    <h3 className="mt-2 line-clamp-2 min-h-10 text-sm text-white">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-2">

                      <span className="font-medium">
                        ₹{salePrice.toLocaleString("en-IN")}
                      </span>

                      {product.discount > 0 && (
                        <span className="text-xs text-white/35 line-through">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      )}

                    </div>

                  </div>

                </Link>
              )
            })}

          </div>
        )}

      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-8 text-center">

        <p className="text-lg tracking-[0.25em]">
          TIME<span className="text-[#d8a84e]">HUB</span>
        </p>

        <p className="mt-2 text-xs text-white/40">
          Luxury Timepieces
        </p>

        <p className="mt-4 text-[11px] text-white/30">
          © {new Date().getFullYear()} TimeHub. All rights reserved.
        </p>

      </footer>

    </main>
  )
}
