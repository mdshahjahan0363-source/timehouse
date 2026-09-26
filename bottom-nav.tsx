"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Clock, User } from "lucide-react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/history", label: "History", icon: Clock },
  { href: "/my", label: "My", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { cartCount } = useStore()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md border-t border-border bg-popover/95 backdrop-blur">
      <ul className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href)
          const Icon = tab.icon
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                  {tab.href === "/cart" && cartCount > 0 && (
                    <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </span>
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
