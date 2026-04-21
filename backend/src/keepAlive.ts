import { env } from './config/env'

const PING_INTERVAL_MS = 14 * 60 * 1000 // 14 minutes — Render spins down after 15 min

export function startKeepAlive(): void {
  if (!env.isProduction) return

  const backendUrl = process.env.RENDER_EXTERNAL_URL
  if (!backendUrl) {
    console.warn('[keep-alive] RENDER_EXTERNAL_URL not set — keep-alive disabled')
    return
  }

  const healthUrl = `${backendUrl}/api/health`

  setInterval(async () => {
    try {
      const res = await fetch(healthUrl)
      console.log(`[keep-alive] ping → ${res.status}`)
    } catch (err) {
      console.error('[keep-alive] ping failed:', err)
    }
  }, PING_INTERVAL_MS)

  console.log(`[keep-alive] started — pinging ${healthUrl} every 14 min`)
}
