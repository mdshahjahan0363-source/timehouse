"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, ShieldCheck, Truck, Sparkles } from "lucide-react"
import { useStore } from "@/lib/store"
import { discountedPrice } from "@/lib/types"

export default function HomePage() {
  const { products, cartCount, ready } = useStore()

  return (
    <main className="min-h-screen bg-[#0b0a08] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0a08]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-xl tracking-[0.2em]">
            AURELIA
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
      </header>

      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:py-28">
          <p className="mb-4 text-xs uppercase tracking-[0.45em] text-[#d8a84e]">
            Luxury Timepieces
          </p>

          <h1 className="text-4xl font-light tracking-wide sm:text-6xl">
            AURELIA
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
            Precision, elegance and timeless design crafted for those who
            appreciate every second.
          </p>

          <a
            href="#collection"
            className="mt-8 inline-flex rounded-full bg-[#f2b84b] px-7 py-3 font-medium text-black"
          >
            Explore Collection
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 px-5 py-7 text-center">
          <div className="flex flex-col items-center gap-2">
            <Sparkles size={19} className="text-[#d8a84e]" />
            <span className="text-[11px] text-white/60">
              Premium Quality
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Truck size={19} className="text-[#d8a84e]" />
            <span className="text-[11px] text-white/60">
              Fast Delivery
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ShieldCheck size={19} className="text-[#d8a84e]" />
            <span className="text-[11px] text-white/60">
              Secure Shopping
            </span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="collection" className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d8a84e]">
              Our Collection
            </p>
            <h2 className="mt-2 text-2xl font-light sm:text-3xl">
              Featured Timepieces
            </h2>
          </div>

          <Link
            href="/cart"
            className="text-sm text-white/50 hover:text-white"
          >
            Cart ({cartCount})
          </Link>
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
                      {product.brand || "AURELIA"}
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
      <footer className="border-t border-white/10 px-5 py-10 text-center">
        <p className="text-lg tracking-[0.2em]">AURELIA</p>
        <p className="mt-2 text-xs text-white/40">
          Luxury Timepieces
        </p>
        <p className="mt-5 text-[11px] text-white/30">
          © {new Date().getFullYear()} AURELIA. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
