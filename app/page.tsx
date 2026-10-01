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

      {/* FIXED HEADER */}
      <header className="fixed left-0 right-0 top-0 z-[9999] border-b border-white/10 bg-[#0b0a08]/98 backdrop-blur-xl">

        <div className="mx-auto max-w-7xl px-5 py-2.5">

          <div className="flex items-center justify-between">

            <a href="/" className="block">
              <div className="text-[22px] font-medium tracking-[0.18em]">
                TIME<span className="text-[#d8a84e]">HUB</span>
              </div>

              <div className="mt-0.5 text-[9px] font-semibold tracking-[0.25em] text-white/75">
                Luxury Timepieces
              </div>
            </a>

            {/* ADMIN - DIRECT LINK */}
            <a
              href="/admin"
              className="relative z-[10000] flex h-[40px] cursor-pointer items-center rounded-full border border-white/15 px-5 text-sm text-white/80"
            >
              Admin
            </a>

          </div>

          {/* SEARCH */}
          <div className="mt-2.5">

            <div className="flex h-[44px] items-center rounded-[15px] border border-white/15 bg-[#151310] px-3">

              <Search className="mr-3 size-5 text-white/50" />

              <input
                type="text"
                placeholder="Search watches"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />

            </div>

          </div>

        </div>

      </header>

      {/* SPACE FOR FIXED HEADER */}
      <div className="h-[122px]" />

      {/* HERO */}
      <section className="border-b border-white/10 px-5 py-3">

        <div className="mx-auto max-w-7xl">

          <div className="relative h-[160px] overflow-hidden rounded-[20px] border border-white/15 bg-[#17130f] px-5 py-3">

            {/* WATCH */}
            <div className="pointer-events-none absolute right-[-2px] top-[-8px] opacity-45">

              <div className="relative h-[176px] w-[125px]">

                <div className="absolute left-[43px] top-0 h-[45px] w-[40px] rounded-[13px] border-[6px] border-[#b47a18]" />

                <div className="absolute left-[4px] top-[35px] h-[105px] w-[105px] rounded-full border-[7px] border-[#b47a18]">

                  <div className="absolute inset-[9px] rounded-full border-[2px] border-[#b47a18]/60">

                    <div className="absolute left-1/2 top-1/2 h-[32px] w-[4px] -translate-x-1/2 -translate-y-[85%] rotate-[25deg] rounded-full bg-[#b47a18]" />

                    <div className="absolute left-1/2 top-1/2 h-[25px] w-[3px] -translate-x-1/2 -translate-y-[20%] rotate-[105deg] rounded-full bg-[#b47a18]" />

                  </div>

                </div>

                <div className="absolute right-[-3px] top-[82px] h-[18px] w-[9px] rounded-r-md bg-[#b47a18]" />

                <div className="absolute bottom-0 left-[43px] h-[45px] w-[40px] rounded-[13px] border-[6px] border-[#b47a18]" />

              </div>

            </div>

            {/* HERO CONTENT */}
            <div className="relative z-10 max-w-[67%]">

              <p className="text-[7px] uppercase tracking-[0.32em] text-[#d8a84e]">
                New Collection
              </p>

              <h1 className="mt-1.5 max-w-[250px] font-serif text-[18px] font-light leading-[0.98] tracking-tight">
                Timeless craftsmanship on your wrist
              </h1>

              <p className="mt-2 max-w-[230px] text-[7px] leading-3 text-white/55">
                Hand-picked luxury watches, delivered with care.
              </p>

              <a
                href="#collection"
                className="mt-2 inline-flex rounded-full bg-[#f2b84b] px-4 py-1.5 text-[8px] font-medium text-black"
              >
                Explore Collection
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES - SMALL HEIGHT */}
      <section className="px-5 py-2">

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3">

          {/* AUTHENTIC */}
          <div className="flex h-[48px] items-center gap-2 rounded-[14px] border border-white/10 bg-[#151310] px-3">

            <ShieldCheck className="size-5 shrink-0 text-[#d8a84e]" />

            <div>
              <div className="text-[12px] font-medium">
                Authentic
              </div>

              <div className="text-[8px] text-white/50">
                100% genuine
              </div>
            </div>

          </div>

          {/* FAST DELIVERY */}
          <div className="flex h-[48px] items-center gap-2 rounded-[14px] border border-white/10 bg-[#151310] px-3">

            <Truck className="size-5 shrink-0 text-[#d8a84e]" />

            <div>
              <div className="text-[12px] font-medium">
                Fast Delivery
              </div>

              <div className="text-[8px] text-white/50">
                Across India
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* COLLECTION */}
      <section
        id="collection"
        className="mx-auto max-w-7xl px-5 py-7"
      >

        <div className="mb-5 flex items-end justify-between">

          <div>

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#d8a84e]">
              Our Collection
            </p>

            <h2 className="mt-1.5 font-serif text-3xl font-light">
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

        <p className="mt-2 text-xs text-white/50">
          Luxury Timepieces
        </p>

        <p className="mt-5 text-[11px] text-white/30">
          © {new Date().getFullYear()} TimeHub. All rights reserved.
        </p>

      </footer>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-[#0b0a08]/95 backdrop-blur">

        <div className="mx-auto grid max-w-md grid-cols-4">

          <Link
            href="/"
            className="flex flex-col items-center gap-1 py-3 text-[#f2b84b]"
          >
            <Sparkles className="size-6" />
            <span className="text-xs">Home</span>
          </Link>

          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-1 py-3 text-white/50"
          >

            <ShoppingBag className="size-6" />

            {cartCount > 0 && (
              <span className="absolute right-[28%] top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f2b84b] px-1 text-[10px] text-black">
                {cartCount}
              </span>
            )}

            <span className="text-xs">Cart</span>

          </Link>

          <Link
            href="/history"
            className="flex flex-col items-center gap-1 py-3 text-white/50"
          >
            <div className="flex size-6 items-center justify-center rounded-full border-2 border-current">
              <div className="h-2 w-0.5 bg-current" />
            </div>
            <span className="text-xs">History</span>
          </Link>

          <Link
            href="/my"
            className="flex flex-col items-center gap-1 py-3 text-white/50"
          >
            <div className="size-6 rounded-full border-2 border-current" />
            <span className="text-xs">My</span>
          </Link>

        </div>

      </div>

    </main>
  )
}
