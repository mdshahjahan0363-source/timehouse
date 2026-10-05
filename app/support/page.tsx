"use client"

import Link from "next/link"
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Facebook,
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
              How can we help you?
            </p>
          </div>

        </div>
      </header>

      <section className="mx-auto max-w-md px-4 py-5">

        <div className="mb-5">
          <h2 className="text-2xl font-semibold">
            Contact Us
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Choose an option below to get in touch with us.
          </p>
        </div>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/919241331531"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
            <MessageCircle className="size-6" />
          </div>

          <div className="flex-1">
            <p className="font-medium">
              WhatsApp
            </p>
            <p className="mt-1 text-xs text-white/40">
              Chat with us on WhatsApp
            </p>
          </div>
        </a>

        {/* EMAIL */}
        <a
          href="mailto:support@timehub.com"
          className="mb-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <Mail className="size-6" />
          </div>

          <div className="flex-1">
            <p className="font-medium">
              Email
            </p>
            <p className="mt-1 text-xs text-white/40">
              Send us an email
            </p>
          </div>
        </a>

        {/* CONTACT */}
        <a
          href="tel:+919241331531"
          className="mb-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <Phone className="size-6" />
          </div>

          <div className="flex-1">
            <p className="font-medium">
              Contact Us
            </p>
            <p className="mt-1 text-xs text-white/40">
              Call our support team
            </p>
          </div>
        </a>

        {/* INSTAGRAM */}
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <Instagram className="size-6" />
          </div>

          <div className="flex-1">
            <p className="font-medium">
              Instagram
            </p>
            <p className="mt-1 text-xs text-white/40">
              Follow us on Instagram
            </p>
          </div>
        </a>

        {/* FACEBOOK */}
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
            <Facebook className="size-6" />
          </div>

          <div className="flex-1">
            <p className="font-medium">
              Facebook
            </p>
            <p className="mt-1 text-xs text-white/40">
              Follow us on Facebook
            </p>
          </div>
        </a>

      </section>

    </main>
  )
}
