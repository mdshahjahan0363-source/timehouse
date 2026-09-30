"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Search,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Home,
  Clock3,
  User,
} from "lucide-react"

import { useStore } from "@/lib/store"
import { discountedPrice } from "@/lib/types"

export default function HomePage() {
  const { products, cartCount, ready } = useStore()
  const [search, setSearch] = useState("")

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return products
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        (product.brand || "")
          .toLowerCase()
          .includes(query) ||
        product.description
          .toLowerCase()
          .includes(query)
      )
    })
  }, [products, search])

  return (
    <main className="min-h-screen bg-[#0b0a08] pb-24 text-white">

      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0a08]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 pt-4 pb-4">

          {/* Brand Row */}
          <div className="flex items-center justify-between">

            <Link href="/" className="block">
              <div className="text-[25px] tracking-[0.22em]">
                TIME<span className="text-[#d8a84e]">HUB</span>
              </div>

              <div className="mt-1 text-[10px] tracking-[0.25em] text-white/45">
                Luxury Timepieces
              </div>
            </Link>

            <div className="flex items-center gap-3">

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative flex size-12 items-center justify-center rounded-full border border-white/15"
              >
                <ShoppingBag size={21} />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f2b84b] px-1.5 text-xs font-semibold text-black">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Admin */}
              <Link
                href="/admin"
                className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/70"
              >
                Admin
              </Link>

            </div>
          </div>

          {/* SEARCH BOX - TOP */}
          <div className="relative mt-4">

            <Search
              size={23}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search watches"
              className="h-14 w-full rounded-2xl border border-white/15 bg-[#171411] pl-12 pr-4 text-base text-white outline-none placeholder:text-white/35 focus:border-[#d8a84e]/60"
            />

          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="px-5 pt-5">

        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#171310]">

            {/* Decorative Watch */}
            <div className="pointer-events-none absolute -right-14 top-3 opacity-20">

              <div className="flex h-56 w-36 items-center justify-center rounded-[65px] border-[17px] border-[#8d6725]">

                <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-[#8d6725]">

                  <div className="h-10 w-2 rounded-full bg-[#8d6725]" />

                </div>

              </div>

            </div>

            <div className="relative px-9 py-6">

              <p className="text-[10px] uppercase tracking-[0.4em] text-[#d8a84e]">
                New Collection
              </p>

              <h1 className="mt-3 max-w-[350px] font-serif text-[31px] leading-[1.12]">
                Timeless
                <br />
                craftsmanship
                <br />
                on your wrist
              </h1>

              <p className="mt-4 max-w-[350px] text-xs leading-5 text-white/50">
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
      <section className="px-5 pt-4">

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3">

          <div className="flex min-h-[90px] items-center gap-3 rounded-2xl border border-white/10 bg-[#151310] px-4">
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

          <div className="flex min-h-[90px] items-center gap-3 rounded-2xl border border-white/10 bg-[#151310] px-4">
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

      {/* COLLECTION */}
      <section
        id="collection"
        className="mx-auto max-w-7xl px-5 pt-9 pb-8"
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
            {filteredProducts.length} items
          </span>

        </div>

        {!ready ? (
          <div className="py-16 text-center text-white/45">
            Loading collection...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151310] py-16 text-center text-white/45">
            No watches found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">

            {filteredProducts.map((product) => {
              const salePrice = discountedPrice(product)

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151310]"
                >

                  {/* PRODUCT IMAGE */}
                  <div className="relative aspect-square overflow-hidden bg-[#11100e]">

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="50vw"
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

                  {/* PRODUCT DETAILS */}
                  <div className="p-4">

                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#d8a84e]">
                      {product.brand || "TIMEHUB"}
                    </p>

                    <h3 className="mt-2 min-h-[40px] line-clamp-2 text-sm leading-5">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">

                      <span className="font-medium">
                        ₹
                        {salePrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      {product.discount > 0 && (
                        <span className="text-xs text-white/35 line-through">
                          ₹
                          {product.price.toLocaleString(
                            "en-IN"
                          )}
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

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#12100d]/95 backdrop-blur-xl">

        <div className="mx-auto grid max-w-xl grid-cols-4">

          <Link
            href="/"
            className="flex flex-col items-center gap-1.5 py-3.5 text-[#f2b84b]"
          >
            <Home size={23} />

            <span className="text-[11px]">
              Home
            </span>
          </Link>

          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-1.5 py-3.5 text-white/55"
          >
            <div className="relative">

              <ShoppingBag size={23} />

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
            className="flex flex-col items-center gap-1.5 py-3.5 text-white/55"
          >
            <Clock3 size={23} />

            <span className="text-[11px]">
              History
            </span>
          </Link>

          <Link
            href="/my"
            className="flex flex-col items-center gap-1.5 py-3.5 text-white/55"
          >
            <User size={23} />

            <span className="text-[11px]">
              My
            </span>
          </Link>

        </div>

      </nav>

    </main>
  )
}
