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
  with_games?: number        // Games played on same team as this pro
  with_win?: number
  against_games?: number     // Games played against this pro
  against_win?: number
}

export type MatchFilter = 'all' | 'with' | 'against'

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

export interface CarryComparisonMetric {
  key: 'gold_per_min' | 'xp_per_min' | 'last_hits_per_10' | 'hero_damage' | 'tower_damage'
  label: string
  userValue: number
  proValue: number
  difference: number
  ratio: number
  passed: boolean
}

export interface CarryItemTimingComparison {
  itemKey: string
  itemName: string
  userMinute: number | null
  proMinute: number
  differenceMinutes: number | null
  status: 'on_time' | 'late' | 'missing'
}

export interface CarryComparisonResponse {
  account_id: number
  match_id: number
  hero_id: number
  benchmark_percentile: 95 | 99
  scenario: 'stomp' | 'comeback'
  fulfilled_role: boolean
  efficiency_gap: {
    score: number
    gpmRatio: number
    lh10Ratio: number
    feedback: string
  }
  metrics: CarryComparisonMetric[]
  item_timings: CarryItemTimingComparison[]
  raw_user: {
    gold_per_min: number
    xp_per_min: number
    last_hits: number
    hero_damage: number
    tower_damage: number
    purchase_log: Array<{
      time: number
      key: string
    }>
  }
}
