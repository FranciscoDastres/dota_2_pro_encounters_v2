/** One pro player entry as returned by /players/{accountId}/pros */
export interface ProEncounter {
  account_id: number
  name?: string | null       // Professional/scene name (e.g. "Miracle-", "N0tail")
  avatarfull: string
  profileurl: string
  personaname: string        // Current Steam display name (can change)
  team_name: string | null
  last_match_time: string | null // ISO date string
  games: number
  win: number
  country_code: string | null
}

export interface ProEncountersResponse {
  account_id: number
  pros: ProEncounter[]
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

/** One shared match entry returned by /api/pro-matches/:accountId/:proAccountId */
export interface SharedMatch {
  match_id: number
  start_time: number     // Unix timestamp (seconds)
  radiant_win: boolean
  player_slot: number    // 0-4 = radiant, 128-132 = dire
  hero_id: number
  kills: number
  deaths: number
  assists: number
  duration: number       // seconds
}

export interface SharedMatchesResponse {
  account_id: number
  pro_account_id: number
  matches: SharedMatch[]
}
