import axios from 'axios'
import { env } from '../config/env'
import type { OpenDotaProPlayer, OpenDotaMatch, OpenDotaMatchDetail } from '../types'

const client = axios.create({
  baseURL: env.OPENDOTA_API_URL,
  timeout: 15_000,
  params: env.OPENDOTA_API_KEY ? { api_key: env.OPENDOTA_API_KEY } : {},
})

/**
 * Returns the full list of professional players tracked by OpenDota.
 */
export async function getProPlayers(): Promise<OpenDotaProPlayer[]> {
  const { data } = await client.get<OpenDotaProPlayer[]>('/proPlayers')
  return data
}

/**
 * Returns the last `limit` public matches for a given account.
 */
export async function getPlayerMatches(
  accountId: number,
  limit = 50,
): Promise<OpenDotaMatch[]> {
  const { data } = await client.get<OpenDotaMatch[]>(`/players/${accountId}/matches`, {
    params: { limit },
  })
  return data
}

/**
 * Returns full match details including all 10 players.
 */
export async function getMatchDetail(matchId: number): Promise<OpenDotaMatchDetail> {
  const { data } = await client.get<OpenDotaMatchDetail>(`/matches/${matchId}`)
  return data
}
