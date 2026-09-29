"use client"

import { useCallback, type ReactNode } from "react"

type ToastType = "success" | "error" | "info"

export function ToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useToast() {
  return useCallback((message: string, _type?: ToastType) => {
    console.log(message)
  }, [])
}
