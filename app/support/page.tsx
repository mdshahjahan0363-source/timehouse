"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  ExternalLink,
  Headphones,
} from "lucide-react"

type SupportOption = {
  id: string
  title: string
  description: string
  type: string
  link: string
  enabled: boolean
}

export default function SupportPage() {
  const [support, setSupport] =
    useState<SupportOption[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetch("/api/admin/support", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setSupport(
          (data.support || []).filter(
            (item: SupportOption) =>
              item.enabled !== false,
          ),
        )
      })
      .catch(() => {
        setSupport([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-dvh bg-[#0b0a08] pb-10 text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0a08]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-4">

          <Link
            href="/my"
            className="flex size-10 items-center justify-center rounded-full border border-white/15"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <h1 className="text-lg font-semibold">
              Customer Support
            </h1>

            <p className="text-[11px] text-white/40">
              We are here to help you
            </p>
          </div>

        </div>
      </header>

      <section className="mx-auto max-w-md px-4 py-5">

        <div className="mb-5">
          <h2 className="text-2xl font-semibold">
            How can we help?
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Choose an option to contact TimeHub support.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#151310] p-6 text-center">
            <p className="text-sm text-white/50">
              Loading support...
            </p>
          </div>
        ) : support.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151310] p-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#f2b84b]/10 text-[#f2b84b]">
              <Headphones className="size-6" />
            </div>

            <p className="mt-3 text-sm font-medium">
              Support unavailable
            </p>

            <p className="mt-1 text-xs text-white/40">
              Please try again later.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {support.map((item) => (
              <SupportCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        )}

      </section>
    </main>
  )
}

function SupportCard({
  item,
}: {
  item: SupportOption
}) {
  const isExternal =
    item.type === "whatsapp" ||
    item.type === "instagram" ||
    item.type === "facebook"

  return (
    <a
      href={item.link}
      target={isExternal ? "_blank" : undefined}
      rel={
        isExternal
          ? "noopener noreferrer"
          : undefined
      }
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4 transition active:scale-[0.99]"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">

        {item.type === "whatsapp" ? (
          <WhatsAppLogo />
        ) : item.type === "instagram" ? (
          <InstagramLogo />
        ) : item.type === "facebook" ? (
          <FacebookLogo />
        ) : item.type === "email" ? (
          <Mail className="size-5" />
        ) : item.type === "phone" ||
          item.type === "contact" ? (
          <Phone className="size-5" />
        ) : (
          <Headphones className="size-5" />
        )}

      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {item.title}
        </p>

        <p className="mt-1 text-xs text-white/40">
          {item.description}
        </p>
      </div>

      <ExternalLink className="size-5 shrink-0 text-white/30" />
    </a>
  )
}

function WhatsAppLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.9-1.3A9.5 9.5 0 1 0 12 2.5Zm0 17.2c-1.5 0-2.9-.4-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A7.7 7.7 0 1 1 12 19.7Zm4.2-5.7c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.5.7-.6.8-.1.2-.2.2-.4.1-1-.5-1.7-.9-2.4-2-.2-.3-.4-.7-.5-1-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.3.1-.1 0-.2 0-.3-.1-.1-.5-1.2-.7-1.6-.2-.4-.3-.3-.5-.3h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.5 2.4 3.7 3.3 2.2.9 2.2.6 2.6.6.4 0 1.2-.5 1.4-.9.2-.4.2-.8.1-.9-.1-.1-.2-.1-.4-.2Z" />
    </svg>
  )
}

function InstagramLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

function FacebookLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.6v8h2.9Z" />
    </svg>
  )
}
