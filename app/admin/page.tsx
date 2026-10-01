"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
  Search,
} from "lucide-react"

import { useStore } from "@/lib/store"
import { discountedPrice } from "@/lib/types"

export default function HomePage() {
  const { products, cartCount, ready } = useStore()

  return (
    <main className="min-h-screen bg-[#0b0a08] text-white">

      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#0b0a08]">
        <div className="mx-auto max-w-7xl px-5 py-5">

          <div className="flex items-center justify-between">
            <Link href="/" className="block">
              <div className="text-[27px] font-medium tracking-[0.22em]">
                TIME<span className="text-[#d8a84e]">HUB</span>
              </div>

              <div className="mt-1 text-[11px] tracking-[0.28em] text-white/45">
                Luxury Timepieces
              </div>
            </Link>

            <div className="flex items-center">
              <Link
                href="/admin"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/70"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mt-6">
            <div className="flex h-[78px] items-center rounded-[22px] border border-white/15 bg-[#151310] px-5">
              <Search className="mr-4 size-7 text-white/45" />

              <input
                type="text"
                placeholder="Search watches"
                className="w-full bg-transparent text-lg text-white outline-none placeholder:text-white/40"
              />
            </div>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto max-w-7xl">

          <div className="relative h-[320px] overflow-hidden rounded-[22px] border border-white/15 bg-[#17130f] px-6 py-6">

            {/* WATCH DECORATION */}
            <div className="pointer-events-none absolute -right-8 top-5 opacity-20">
              <div className="relative h-64 w-44">

                <div className="absolute left-16 top-0 h-16 w-16 rounded-[20px] border-[9px] border-[#9b6b18]" />

                <div className="absolute left-2 top-12 h-36 w-36 rounded-full border-[9px] border-[#9b6b18]">
                  <div className="absolute left-1/2 top-1/2 h-10 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9b6b18]" />
                </div>

                <div className="absolute bottom-0 left-16 h-16 w-16 rounded-[20px] border-[9px] border-[#9b6b18]" />

              </div>
            </div>

            <div className="relative z-10 max-w-[72%]">

              <p className="text-[9px] uppercase tracking-[0.35em] text-[#d8a84e]">
                New Collection
              </p>

              <h1 className="mt-4 font-serif text-[34px] font-light leading-[1.05] tracking-tight">
                Timeless craftsmanship on your wrist
              </h1>

              <p className="mt-4 text-[13px] leading-5 text-white/50">
                Hand-picked luxury watches, delivered with care.
              </p>

              <a
                href="#collection"
                className="mt-5 inline-flex rounded-full bg-[#f2b84b] px-6 py-3 text-[13px] font-medium text-black"
              >
                Explore Collection
              </a>

            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-4">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4">

          <div className="flex h-[105px] items-center gap-4 rounded-[22px] border border-white/10 bg-[#151310] px-5">
            <ShieldCheck className="size-8 shrink-0 text-[#d8a84e]" />

            <div>
              <div className="text-base font-medium">
                Authentic
              </div>

              <div className="mt-1 text-sm text-white/45">
                100% genuine
              </div>
            </div>
          </div>

          <div className="flex h-[105px] items-center gap-4 rounded-[22px] border border-white/10 bg-[#151310] px-5">
            <Truck className="size-8 shrink-0 text-[#d8a84e]" />

            <div>
              <div className="text-base font-medium">
                Fast Delivery
              </div>

              <div className="mt-1 text-sm text-white/45">
                Across India
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* COLLECTION */}
      <section
        id="collection"
        className="mx-auto max-w-7xl px-5 py-8"
      >

        <div className="mb-6 flex items-end justify-between">

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d8a84e]">
              Our Collection
            </p>

            <h2 className="mt-2 font-serif text-3xl font-light">
              All Watches
            </h2>
          </div>

          <span className="text-sm text-white/45">
            {products.length} items
          </span>

        </div>

        {!ready ? (
          <div className="py-20 text-center text-white/50">
            Loading collection...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 py-20 text-center text-white/50">
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
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#11100e] transition hover:border-[#d8a84e]/40"
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
                      <span className="absolute left-3 top-3 rounded-full bg-[#f2b84b] px-2 py-1 text-[10px] font-semibold text-black">
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

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-5 py-10 text-center">

        <p className="text-lg tracking-[0.2em]">
          TIME<span className="text-[#d8a84e]">HUB</span>
        </p>

        <p className="mt-2 text-xs text-white/40">
          Luxury Timepieces
        </p>

        <p className="mt-5 text-[11px] text-white/30">
          © {new Date().getFullYear()} TimeHub. All rights reserved.
        </p>

      </footer>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0b0a08]/95 backdrop-blur">
        <div className="mx-auto
