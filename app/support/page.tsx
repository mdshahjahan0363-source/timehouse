"use client"

import Link from "next/link"
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react"

export default function SupportPage() {
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

        {/* TITLE */}
        <div className="mb-5">
          <h2 className="text-2xl font-semibold">
            How can we help?
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Choose an option to contact TimeHub support.
          </p>
        </div>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/919241331531"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <MessageCircle className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              WhatsApp
            </p>

            <p className="mt-1 text-xs text-white/40">
              Chat with us on WhatsApp
            </p>
          </div>

          <ExternalLink className="size-5 text-white/30" />
        </a>

        {/* EMAIL */}
        <a
          href="mailto:support@timehub.com"
          className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <Mail className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              Email
            </p>

            <p className="mt-1 text-xs text-white/40">
              Send us an email
            </p>
          </div>

          <ExternalLink className="size-5 text-white/30" />
        </a>

        {/* CONTACT */}
        <a
          href="tel:+919241331531"
          className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <Phone className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              Contact
            </p>

            <p className="mt-1 text-xs text-white/40">
              Call our customer support
            </p>
          </div>

          <ExternalLink className="size-5 text-white/30" />
        </a>

        {/* INSTAGRAM */}
        <a
          href="#"
          className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <span className="text-lg font-bold">◎</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              Instagram
            </p>

            <p className="mt-1 text-xs text-white/40">
              Follow us on Instagram
            </p>
          </div>

          <ExternalLink className="size-5 text-white/30" />
        </a>

        {/* FACEBOOK */}
        <a
          href="#"
          className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <span className="text-lg font-bold">f</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              Facebook
            </p>

            <p className="mt-1 text-xs text-white/40">
              Follow us on Facebook
            </p>
          </div>

          <ExternalLink className="size-5 text-white/30" />
        </a>

      </section>

    </main>
  )
}
