"use client"

import { useEffect } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null

export function installPwa() {
  if (!deferredPrompt) {
    return false
  }

  deferredPrompt.prompt()

  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null

    window.dispatchEvent(
      new Event("pwa-install-completed")
    )
  })

  return true
}

export function PwaInstall() {
  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()

      deferredPrompt =
        event as BeforeInstallPromptEvent

      window.dispatchEvent(
        new Event("pwa-install-available")
      )
    }

    window.addEventListener(
      "beforeinstallprompt",
      handler
    )

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      )
    }
  }, [])

  return null
}
