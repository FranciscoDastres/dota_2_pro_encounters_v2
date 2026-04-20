import { getPlayerPros } from './openDota.service'
import { env } from '../config/env'
import type { OpenDotaProEncounter } from '../types'

/** Cache TTL: 1 hour */
const CACHE_TTL_MS = 60 * 60 * 1000

/**
 * Returns pro encounters for a given account, reading from Supabase
 * match_cache when available (and fresh). Falls back to live OpenDota
 * call when Supabase is not configured or the cache entry is stale.
 */
export async function getPlayerProsWithCache(accountId: number): Promise<OpenDotaProEncounter[]> {
  const hasSupabase = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)

  if (!hasSupabase) {
    return getPlayerPros(accountId)
  }

  const { supabase } = await import('./supabase.service')

  const { data: cached } = await supabase
    .from('match_cache')
    .select('pros, cached_at')
    .eq('steam_id', accountId)
    .single()

  if (cached) {
    const age = Date.now() - new Date(cached.cached_at as string).getTime()
    if (age < CACHE_TTL_MS) {
      return cached.pros as OpenDotaProEncounter[]
    }
  }

  const pros = await getPlayerPros(accountId)

  await supabase
    .from('match_cache')
    .upsert(
      { steam_id: accountId, pros, cached_at: new Date().toISOString() },
      { onConflict: 'steam_id' },
    )

  return pros
}
