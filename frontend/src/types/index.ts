export interface ProPlayer {
  account_id: number
  name: string
  team_name: string | null
  team_tag: string | null
  avatar: string
  is_teammate: boolean
}

export interface ProEncounterMatch {
  match_id: number
  start_time: number // unix timestamp (seconds)
  duration: number // seconds
  game_mode: number
  radiant_win: boolean
  player_slot: number // 0-4 radiant, 128-132 dire
  hero_id: number
  kills: number
  deaths: number
  assists: number
  pro_players: ProPlayer[]
}

export interface ProEncountersResponse {
  steam_id: string
  account_id: number
  total_matches_checked: number
  pro_encounters: ProEncounterMatch[]
  last_updated: string
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'
