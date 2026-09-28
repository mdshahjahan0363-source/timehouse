"use client"

import { useCallback, useState } from "react"

export function useToast() {
  const [message, setMessage] = useState<string | null>(null)

  const toast = useCallback((text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 3000)
  }, [])

  return { toast, message }
}
 
