"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  User,
  MapPin,
  ShoppingBag,
  ChevronRight,
} from "lucide-react"

import { useStore } from "@/lib/store"

export default function MyPage() {
  const {
    profile,
    addresses,
    orders,
    ready,
  } = useStore()

  const [customerMobile, setCustomerMobile] =
    useState("")

  useEffect(() => {
    const savedMobile =
      localStorage.getItem(
        "timehouse_customer_mobile"
      )

    if (savedMobile) {
      setCustomerMobile(
        savedMobile
          .replace(/\D/g, "")
          .slice(-10)
      )
      return
    }

    if (profile?.phone) {
      setCustomerMobile(
        profile.phone
          .replace(/\D/g, "")
          .slice(-10)
      )
    }
  }, [profile?.phone])

  const myOrders = orders.filter((order) => {
    const orderMobile =
      order.address?.mobile
        ?.replace(/\D/g, "")
        .slice(-10)

    return (
      customerMobile &&
      orderMobile === customerMobile
    )
  })

  if (!ready) {
    return (
      <main className="min-h-dvh bg-[#0b0a08] text-white">
        <div className="flex min-h-dvh items-center justify-center text-white/50">
          Loading...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-[#0b0a08] pb-10 text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0a08]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-4">

          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-full border border-white/15"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <h1 className="text-lg font-semibold">
              My Account
            </h1>

            <p className="text-[11px] text-white/40">
              Your profile and account
            </p>
          </div>

        </div>
      </header>

      <section className="mx-auto max-w-md px-4 py-5">

        {/* PROFILE */}
        <div className="rounded-2xl border border-white/10 bg-[#151310] p-5">

          <div className="flex items-center gap-4">

            <div className="flex size-14 items-center justify-center rounded-full bg-[#f2b84b]/15 text-[#f2b84b]">
              <User className="size-7" />
            </div>

            <div className="min-w-0 flex-1">

              <h2 className="truncate text-lg font-semibold">
                {profile?.name || "Guest User"}
              </h2>

              <p className="mt-1 truncate text-xs text-white/40">
                {profile?.email || "No email added"}
              </p>

              {profile?.phone && (
                <p className="mt-1 text-xs text-white/40">
                  {profile.phone}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ORDERS */}
        <Link
          href="/history"
          className="mt-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >

          <div className="flex size-11 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <ShoppingBag className="size-5" />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-medium">
              My Orders
            </p>

            <p className="mt-1 text-xs text-white/40">
              {myOrders.length}{" "}
              {myOrders.length === 1
                ? "order"
                : "orders"}
            </p>

          </div>

          <ChevronRight className="size-5 text-white/30" />

        </Link>

        {/* ADDRESS */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#151310] p-4">

          <div className="flex items-center gap-3">

            <div className="flex size-11 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
              <MapPin className="size-5" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Saved Addresses
              </p>

              <p className="mt-1 text-xs text-white/40">
                {addresses.length}{" "}
                {addresses.length === 1
                  ? "address"
                  : "addresses"}{" "}
                saved
              </p>
            </div>

          </div>

          {addresses.length > 0 && (
            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">

              {addresses.map(
                (address, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-[#0b0a08] p-3"
                  >

                    <p className="text-sm font-medium">
                      {address.fullName}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/40">
                      {address.address},{" "}
                      {address.city},{" "}
                      {address.state} -{" "}
                      {address.pincode}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      +91 {address.mobile}
                    </p>

                  </div>
                ),
              )}

            </div>
          )}

        </div>

        {/* STORE BUTTON */}
        <Link
          href="/"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#f2b84b] py-3.5 text-sm font-semibold text-black"
        >
          Continue Shopping
        </Link>

      </section>

    </main>
  )
}
