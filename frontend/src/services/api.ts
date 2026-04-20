import type { ProEncountersResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function fetchProEncounters(steamId: string): Promise<ProEncountersResponse> {
  const trimmed = steamId.trim()
  if (!trimmed) throw new Error('Steam ID is required')

  const response = await fetch(`${API_BASE_URL}/api/pro-encounters/${encodeURIComponent(trimmed)}`)

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? `Error HTTP ${response.status}`)
  }

  return response.json() as Promise<ProEncountersResponse>
}
