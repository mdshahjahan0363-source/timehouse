"use client"

import {
  Fragment,
  createElement,
  useCallback,
  type ReactNode,
} from "react"

type ToastType = "success" | "error" | "info"

export function ToastProvider({
  children,
}: {
  children: ReactNode
}) {
  return createElement(Fragment, null, children)
}

export function useToast() {
  return useCallback(
    (message: string, _type?: ToastType) => {
      console.log(message)
    },
    [],
  )
}
