import { useEffect } from 'react'

const KOFI_USERNAME = (import.meta.env.VITE_KOFI_USERNAME as string | undefined) ?? 'dnthdev'

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, config: Record<string, string>) => void
    }
  }
}

export function KofiWidget() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
    script.async = true
    script.onload = () => {
      window.kofiWidgetOverlay?.draw(KOFI_USERNAME, {
        type: 'floating-chat',
        'floating-chat.donateButton.text': 'Support me',
        'floating-chat.donateButton.background-color': '#29ABE0',
        'floating-chat.donateButton.text-color': '#fff',
      })
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  return null
}
