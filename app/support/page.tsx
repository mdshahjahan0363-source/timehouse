"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react"

function WhatsAppLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.89c0 2.09.55 4.13 1.59 5.93L.1 24l6.33-1.66a11.86 11.86 0 0 0 5.65 1.43h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.17-1.23-6.15-3.45-8.4ZM12.09 21.76h-.01a9.86 9.86 0 0 1-5.03-1.37l-.36-.21-3.76.99 1-3.66-.23-.38a9.87 9.87 0 0 1-1.51-5.24c0-5.44 4.43-9.87 9.88-9.87 2.64 0 5.12 1.03 6.98 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.44-4.43 9.87-9.85 9.87Zm5.42-7.4c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.67-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.24-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.81.38-.28.3-1.06 1.04-1.06 2.53s1.08 2.94 1.23 3.14c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.49 1.72.63.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
    </svg>
  )
}

function InstagramLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="instagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="45%" stopColor="#DD2A7B" />
          <stop offset="75%" stopColor="#8134AF" />
          <stop offset="100%" stopColor="#515BD4" />
        </linearGradient>
      </defs>

      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="url(#instagramGradient)"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="12"
        r="4.2"
        fill="none"
        stroke="url(#instagramGradient)"
        strokeWidth="2"
      />

      <circle
        cx="17.5"
        cy="6.7"
        r="1.2"
        fill="url(#instagramGradient)"
      />
    </svg>
  )
}

function FacebookLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        fill="white"
        d="M13.35 19v-6.15h2.06l.31-2.4h-2.37V8.92c0-.69.19-1.16 1.18-1.16h1.27V5.61c-.22-.03-.97-.1-1.85-.1-1.84 0-3.1 1.12-3.1 3.17v1.77H8.77v2.4h2.08V19h2.5Z"
      />
    </svg>
  )
}

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
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4 transition active:scale-[0.98]"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
            <WhatsAppLogo />
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
          className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4 transition active:scale-[0.98]"
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
          className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4 transition active:scale-[0.98]"
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
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4 transition active:scale-[0.98]"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-white/5">
            <InstagramLogo />
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
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151310] p-4 transition active:scale-[0.98]"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-white/5">
            <FacebookLogo />
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
