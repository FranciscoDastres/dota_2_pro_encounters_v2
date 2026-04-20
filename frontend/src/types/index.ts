/** One pro player entry as returned by /players/{accountId}/pros */
export interface ProEncounter {
  account_id: number
  avatarfull: string
  profileurl: string
  personaname: string
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
