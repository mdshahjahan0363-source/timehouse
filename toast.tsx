"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react"

type ToastKind = "success" | "error" | "info" | "warning"
type Toast = { id: number; kind: ToastKind; message: string }

const ToastContext = createContext<{
  toast: (message: string, kind?: ToastKind) => void
} | null>(null)

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const accent = {
  success: "text-success",
  error: "text-destructive",
  info: "text-primary",
  warning: "text-warning",
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, kind, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const Icon = icons[t.kind]
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-xl border border-border bg-popover/95 px-3.5 py-3 text-sm shadow-lg backdrop-blur animate-in fade-in slide-in-from-top-2"
            >
              <Icon className={`size-4 shrink-0 ${accent[t.kind]}`} />
              <span className="text-popover-foreground">{t.message}</span>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx.toast
}
