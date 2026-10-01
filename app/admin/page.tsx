"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Search,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Clock3,
  User,
  Home,
} from "lucide-react"

import { useStore } from "@/lib/store"
import { discountedPrice } from "@/lib/types"

export default function HomePage() {
  const { products, cartCount, ready } = useStore()

  return (
    <main className="min-h-screen bg-[#0b0a08] pb-24 text-white">

      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#0b0a08]">
        <div className="mx-auto max-w-7xl px-5 py-4">

          <div className="flex items-center justify-between">

            <Link href="/" className="block">
              <div className="text-[24px] font-medium tracking-[0.24em]">
                TIME<span className="text-[#d8a84e]">HUB</span>
              </div>

              <div className="mt-0.5 text-[10px] tracking-[0.28em] text-white/45">
                Luxury Timepieces
              </div>
            </Link>

            {/* ONLY ADMIN — TOP CART REMOVED */}
            <Link
              href="/admin"
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70"
            >
              Admin
            </Link>

          </div>

          {/* SEARCH */}
          <div className="mt-4">
            <div className="flex h-[50px] items-center gap-3 rounded-2xl border border-white/15 bg-[#151310] px-4">
              <Search className="size-5 text-white/45" />

              <input
                type="text"
                placeholder="Search watches"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
            </div>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto max-w-7xl">

          <div className="relative min-h-[330px] overflow-hidden rounded-[26px] border border-white/15 bg-[#17130f] px-7 py-7">

            {/* WATCH DECORATION */}
            <div className="pointer-events-none absolute -right-20 top-2 opacity-20">
              <div className="relative h-64 w-52">

                <div className="absolute left-16 top-0 h-20 w-20 rounded-[28px] border-[13px] border-[#9b6b18]" />

                <div className="absolute left-5 top-12 h-40 w-40 rounded-full border-[13px] border-[#9b6b18]">

                  <div className="absolute left-1/2 top-1/2 h-12 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9b6b18]" />

                </div>

                <div className="absolute bottom-0 left-16 h-20 w-20 rounded-[28px] border-[13px] border-[#9b6b18]" />

              </div>
            </div>

            <div className="relative z-10 max-w-[78%]">

              <p className="text-[10px] uppercase tracking-[0.38em] text-[#d8a84e]">
                New Collection
              </p>

              <h1 className="mt-4 font-serif text-[34px] font-light leading-[1.08] tracking-tight sm:text-4xl">
                Timeless
                <br />
                craftsmanship
                <br />
                on your wrist
              </h1>

              <p className="mt-4 max-w-md text-xs leading-5 text-white/50">
                Hand-picked luxury watches, delivered with care.
              </p>

              <a
                href="#collection"
                className="mt-5 inline-flex rounded-full bg-[#f2b84b] px-6 py-3 text-sm font-medium text-black"
              >
                Explore Collection
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-3">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3">

          <div className="flex h-[76px] items-center gap-3 rounded-[22px] border border-white/10 bg-[#151310] px-4">

            <ShieldCheck className="size-7 shrink-0 text-[#d8a84e]" />

            <div>
              <div className="text-sm font-medium">
                Authentic
              </div>

              <div className="mt-0.5 text-[11px] text-white/40">
                100% genuine
              </div>
            </div>

          </div>

          <div className="flex h-[76px] items-center gap-3 rounded-[22px] border border-white/10 bg-[#151310] px-4">

            <Truck className="size-7 shrink-0 text-[#d8a84e]" />

            <div>
              <div className="text-sm font-medium">
                Fast Delivery
              </div>

              <div className="mt-0.5 text-[11px] text-white/40">
                Across India
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* COLLECTION */}
      <section
        id="collection"
        className="mx-auto max-w-7xl px-5 pt-7"
      >

        <div className="mb-5 flex items-end justify-between">

          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#d8a84e]">
              Our Collection
            </p>

            <h2 className="mt-1 font-serif text-3xl font-light">
              All Watches
            </h2>
          </div>

          <span className="text-sm text-white/45">
            {products.length} items
          </span>

        </div>

        {!ready ? (
          <div className="py-16 text-center text-sm text-white/40">
            Loading collection...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 py-16 text-center text-white/40">
            No products available.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">

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
                      sizes="50vw"
                    />

                    {product.discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#f2b84b] px-3 py-1.5 text-[10px] font-semibold text-black">
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

                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#d8a84e]">
                      TIMEHUB
                    </p>

                    <h3 className="mt-2 line-clamp-2 min-h-10 text-sm">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">

                      <span className="text-sm font-medium">
                        ₹{salePrice.toLocaleString("en-IN")}
                      </span>

                      {product.discount > 0 && (
                        <span className="text-[10px] text-white/35 line-through">
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

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#11100d]/95 backdrop-blur">

        <div className="mx-auto grid max-w-2xl grid-cols-4">

          <Link
            href="/"
            className="flex h-[74px] flex-col items-center justify-center gap-1 text-[#f2b84b]"
          >
            <Home className="size-6" />
            <span className="text-[11px]">
              Home
            </span>
          </Link>

          <Link
            href="/cart"
            className="relative flex h-[74px] flex-col items-center justify-center gap-1 text-white/50"
          >

            <div className="relative">

              <ShoppingBag className="size-6" />

              {cartCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f2b84b] px-1 text-[10px] font-semibold text-black">
                  {cartCount}
                </span>
              )}

            </div>

            <span className="text-[11px]">
              Cart
            </span>

          </Link>

          <Link
            href="/history"
            className="flex h-[74px] flex-col items-center justify-center gap-1 text-white/50"
          >
            <Clock3 className="size-6" />
            <span className="text-[11px]">
              History
            </span>
          </Link>

          <Link
            href="/my"
            className="flex h-[74px] flex-col items-center justify-center gap-1 text-white/50"
          >
            <User className="size-6" />
            <span className="text-[11px]">
              My
            </span>
          </Link>

        </div>

      </nav>

    </main>
  )
}
