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
        <header className="border-b border-border px-
