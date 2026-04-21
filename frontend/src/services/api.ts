import { z } from 'zod'
import type { ProEncountersResponse, SharedMatchesResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// ---------- Zod schemas for API response validation ----------

const proEncounterSchema = z.object({
  account_id: z.number(),
  avatarfull: z.string(),
  profileurl: z.string(),
  personaname: z.string(),
  team_name: z.string().nullable(),
  last_match_time: z.string().nullable(),
  games: z.number(),
  win: z.number(),
  country_code: z.string().nullable(),
})

const proEncountersResponseSchema = z.object({
  account_id: z.number(),
  pros: z.array(proEncounterSchema),
})

const sharedMatchSchema = z.object({
  match_id: z.number(),
  start_time: z.number(),
  radiant_win: z.boolean(),
  player_slot: z.number().min(0).max(132),
  hero_id: z.number(),
  kills: z.number().nonnegative(),
  deaths: z.number().nonnegative(),
  assists: z.number().nonnegative(),
  duration: z.number().positive(),
})

const sharedMatchesResponseSchema = z.object({
  account_id: z.number(),
  pro_account_id: z.number(),
  matches: z.array(sharedMatchSchema),
})

// ---------- API functions ----------

export async function fetchProEncounters(steamId: string): Promise<ProEncountersResponse> {
  const trimmed = steamId.trim()
  if (!trimmed) throw new Error('Steam ID is required')

  const response = await fetch(`${API_BASE_URL}/api/pro-encounters/${encodeURIComponent(trimmed)}`)

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? `Error HTTP ${response.status}`)
  }

  const data: unknown = await response.json()
  return proEncountersResponseSchema.parse(data)
}

export async function fetchSharedMatches(
  accountId: number,
  proAccountId: number,
): Promise<SharedMatchesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/pro-matches/${encodeURIComponent(accountId)}/${encodeURIComponent(proAccountId)}`,
  )

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `HTTP Error ${response.status}`)
  }

  const data: unknown = await response.json()
  return sharedMatchesResponseSchema.parse(data)
}
