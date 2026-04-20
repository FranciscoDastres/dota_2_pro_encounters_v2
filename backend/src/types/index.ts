// ─── OpenDota API shapes ────────────────────────────────────────────────────

export interface OpenDotaProPlayer {
  account_id: number
  steamid: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  profileurl: string
  personaname: string
  last_login: string | null
  full_history_time: string | null
  cheese: number
  fh_unavailable: boolean
  loccountrycode: string
  last_match_time: string | null
  name: string | null
  country_code: string | null
  fantasy_role: number
  team_id: number | null
  team_name: string | null
  team_tag: string | null
  is_locked: boolean
  is_pro: boolean
  locked_until: number | null
}

export interface OpenDotaMatch {
  match_id: number
  player_slot: number
  radiant_win: boolean
  duration: number
  game_mode: number
  lobby_type: number
  hero_id: number
  start_time: number
  version: number | null
  kills: number
  deaths: number
  assists: number
  skill: number | null
  average_rank: number | null
  leaver_status: number
  party_size: number | null
}

export interface OpenDotaMatchPlayer {
  account_id: number
  player_slot: number
  hero_id: number
  kills: number
  deaths: number
  assists: number
  personaname?: string
}

export interface OpenDotaMatchDetail {
  match_id: number
  start_time: number
  duration: number
  radiant_win: boolean
  game_mode: number
  players: OpenDotaMatchPlayer[]
}

// ─── App response shapes ─────────────────────────────────────────────────────

export interface ProPlayerSummary {
  account_id: number
  name: string
  team_name: string | null
  team_tag: string | null
  avatar: string
  is_teammate: boolean
}

export interface ProEncounterMatch {
  match_id: number
  start_time: number
  duration: number
  game_mode: number
  radiant_win: boolean
  player_slot: number
  hero_id: number
  kills: number
  deaths: number
  assists: number
  pro_players: ProPlayerSummary[]
}

export interface ProEncountersResponse {
  steam_id: string
  account_id: number
  total_matches_checked: number
  pro_encounters: ProEncounterMatch[]
  last_updated: string
}

export interface ApiErrorResponse {
  error: string
  status: number
}
