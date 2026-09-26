"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { discountedPrice } from "@/lib/types"
import { formatINR } from "@/lib/format"
import { StockBadge } from "@/components/status-badge"

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.discount > 0
  const price = discountedPrice(product)
  const soldOut = product.stock <= 0

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/40">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 480px) 50vw, 200px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            -{product.discount}%
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <span className="rounded-full border border-border bg-popover px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sold out
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.brand && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary/80">
            {product.brand}
          </span>
        )}
        <h3 className="line-clamp-1 text-sm font-medium text-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-sm font-semibold text-foreground">
            {formatINR(price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatINR(product.price)}
            </span>
          )}
        </div>
        <StockBadge stock={product.stock} />
      </div>
    </Link>
  )
}
