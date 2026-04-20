import axios from 'axios'
import { env } from '../config/env'
import type { OpenDotaProEncounter, SharedMatch } from '../types'

const client = axios.create({
  baseURL: env.OPENDOTA_API_URL,
  timeout: 15_000,
  params: env.OPENDOTA_API_KEY ? { api_key: env.OPENDOTA_API_KEY } : {},
})

/**
 * Returns all pro players a given account has played with/against.
 * Endpoint: GET /players/{account_id}/pros
 */
export async function getPlayerPros(accountId: number): Promise<OpenDotaProEncounter[]> {
  const { data } = await client.get<OpenDotaProEncounter[]>(`/players/${accountId}/pros`)
  return data
}

/**
 * Returns the last N matches where both the user and a specific pro
 * were in the same game.
 * Endpoint: GET /players/{account_id}/matches?included_account_id={pro_account_id}&limit={limit}
 */
export async function getSharedMatches(
  accountId: number,
  proAccountId: number,
  limit = 20,
): Promise<SharedMatch[]> {
  const { data } = await client.get<SharedMatch[]>(`/players/${accountId}/matches`, {
    params: { included_account_id: proAccountId, limit },
  })
  return data
}
