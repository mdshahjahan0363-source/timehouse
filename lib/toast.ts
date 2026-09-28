"use client"

import { useCallback } from "react"

type ToastType = "success" | "error" | "info"

export function useToast() {
  return useCallback((message: string, _type?: ToastType) => {
    console.log(message)
  }, [])
}
