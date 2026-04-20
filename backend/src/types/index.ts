// ─── OpenDota API shapes ────────────────────────────────────────────────────

/**
 * Shape returned by GET /players/{account_id}/pros
 * Each item is a pro player the user has played with/against.
 */
export interface OpenDotaProEncounter {
  account_id: number
  avatarfull: string
  profileurl: string
  personaname: string
  team_name: string | null
  last_match_time: string | null // ISO date string e.g. "2024-01-15T20:00:00.000Z"
  games: number
  win: number
  country_code: string | null
}

// ─── App response shapes ─────────────────────────────────────────────────────

export interface ProEncountersResponse {
  account_id: number
  pros: OpenDotaProEncounter[]
}

export interface ApiErrorResponse {
  error: string
  status: number
}
