import axios from 'axios'
import { env } from '../config/env'
import type { OpenDotaProEncounter } from '../types'

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
