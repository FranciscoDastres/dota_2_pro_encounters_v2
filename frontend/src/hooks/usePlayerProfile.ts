import { useState, useEffect } from 'react'

interface OpenDotaPlayerResponse {
  rank_tier: number | null
  profile: {
    account_id: number
    personaname: string
    avatarfull: string
    profileurl: string
    loccountrycode: string | null
  } | null
}

interface HeroStat {
  hero_id: number
  games: number
  win: number
  last_played: number
}

export interface RecentMatch {
  match_id: number
  player_slot: number
  radiant_win: boolean
  hero_id: number
  start_time: number
  duration: number
  kills: number
  deaths: number
  assists: number
}

export interface PlayerProfileData {
  personaname: string
  avatarfull: string
  profileurl: string
  rankTier: number | null
  countryCode: string | null
  totalGames: number
  totalWins: number
  mostPlayedHeroId: number | null
  mostPlayedHeroGames: number
  mostPlayedHeroWinRate: number
  bestHeroId: number | null
  bestHeroWinRate: number
  bestHeroGames: number
  lastMatch: RecentMatch | null
}

const OPENDOTA = 'https://api.opendota.com/api'

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export function usePlayerProfile(accountId: number | null) {
  const [data, setData] = useState<PlayerProfileData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!accountId) { setData(null); return }

    let cancelled = false
    setLoading(true)
    setData(null)

    Promise.all([
      get<OpenDotaPlayerResponse>(`${OPENDOTA}/players/${accountId}`),
      get<HeroStat[]>(`${OPENDOTA}/players/${accountId}/heroes`),
      get<RecentMatch[]>(`${OPENDOTA}/players/${accountId}/recentMatches`),
    ])
      .then(([player, heroStats, recentMatches]) => {
        if (cancelled || !player.profile) return

        const sorted = [...heroStats].sort((a, b) => b.games - a.games)
        const mostPlayed = sorted[0] ?? null

        const eligible = heroStats.filter(h => h.games >= 10)
        const bestHero = eligible.reduce<HeroStat | null>((best, h) => {
          const wr = h.win / h.games
          return !best || wr > best.win / best.games ? h : best
        }, null)

        const totalGames = heroStats.reduce((s, h) => s + h.games, 0)
        const totalWins  = heroStats.reduce((s, h) => s + h.win, 0)

        setData({
          personaname:          player.profile.personaname,
          avatarfull:           player.profile.avatarfull,
          profileurl:           player.profile.profileurl,
          rankTier:             player.rank_tier,
          countryCode:          player.profile.loccountrycode,
          totalGames,
          totalWins,
          mostPlayedHeroId:     mostPlayed?.hero_id ?? null,
          mostPlayedHeroGames:  mostPlayed?.games ?? 0,
          mostPlayedHeroWinRate: mostPlayed ? mostPlayed.win / mostPlayed.games : 0,
          bestHeroId:           bestHero?.hero_id ?? null,
          bestHeroWinRate:      bestHero ? bestHero.win / bestHero.games : 0,
          bestHeroGames:        bestHero?.games ?? 0,
          lastMatch:            recentMatches[0] ?? null,
        })
      })
      .catch(() => { /* profile is decorative — fail silently */ })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [accountId])

  return { data, loading }
}
