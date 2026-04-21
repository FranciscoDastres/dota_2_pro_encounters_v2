import axios, { AxiosError } from 'axios'
import { env } from '../config/env'
import { logger } from '../config/logger'
import type { OpenDotaProEncounter, SharedMatch } from '../types'

const client = axios.create({
  baseURL: env.OPENDOTA_API_URL,
  timeout: 15_000,
  params: env.OPENDOTA_API_KEY ? { api_key: env.OPENDOTA_API_KEY } : {},
})

// ─── Retry with exponential backoff ──────────────────────────────────────────

const MAX_RETRIES = 3
const RETRY_BASE_MS = 500

function isRetryable(err: unknown): boolean {
  if (err instanceof AxiosError) {
    if (!err.response) return true        // network / timeout error
    return err.response.status >= 500     // 5xx server error
  }
  return false
}

async function withRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (!isRetryable(err) || attempt === MAX_RETRIES) break
      const delay = RETRY_BASE_MS * 2 ** (attempt - 1)
      logger.warn(`[${label}] attempt ${attempt} failed — retrying in ${delay}ms`, {
        status: err instanceof AxiosError ? err.response?.status : undefined,
      })
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw lastError
}

// ─── Circuit Breaker ──────────────────────────────────────────────────────────

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

const FAILURE_THRESHOLD = 5   // failures before opening
const RESET_TIMEOUT_MS = 30_000 // ms before attempting HALF_OPEN

class CircuitBreaker {
  private state: CircuitState = 'CLOSED'
  private failures = 0
  private openedAt = 0

  async run<T>(label: string, fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt >= RESET_TIMEOUT_MS) {
        this.state = 'HALF_OPEN'
        logger.info(`[CircuitBreaker:${label}] HALF_OPEN — probing`)
      } else {
        throw new Error('OpenDota service temporarily unavailable (circuit open)')
      }
    }

    try {
      const result = await fn()
      this.onSuccess(label)
      return result
    } catch (err) {
      this.onFailure(label)
      throw err
    }
  }

  private onSuccess(label: string): void {
    if (this.state !== 'CLOSED') {
      logger.info(`[CircuitBreaker:${label}] CLOSED — recovered`)
    }
    this.failures = 0
    this.state = 'CLOSED'
  }

  private onFailure(label: string): void {
    this.failures++
    if (this.failures >= FAILURE_THRESHOLD) {
      this.state = 'OPEN'
      this.openedAt = Date.now()
      logger.error(`[CircuitBreaker:${label}] OPEN after ${this.failures} failures`)
    }
  }
}

const breaker = new CircuitBreaker()

function withResilience<T>(label: string, fn: () => Promise<T>): Promise<T> {
  return breaker.run(label, () => withRetry(label, fn))
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Returns all pro players a given account has played with/against.
 * Endpoint: GET /players/{account_id}/pros
 */
export async function getPlayerPros(accountId: number): Promise<OpenDotaProEncounter[]> {
  const { data } = await withResilience('getPlayerPros', () =>
    client.get<OpenDotaProEncounter[]>(`/players/${accountId}/pros`),
  )
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
  const { data } = await withResilience('getSharedMatches', () =>
    client.get<SharedMatch[]>(`/players/${accountId}/matches`, {
      params: { included_account_id: proAccountId, limit },
    }),
  )
  return data
}
